;(() => {
  // node_modules/@liveblocks/core/dist/index.mjs
  var PKG_NAME = '@liveblocks/core'
  var PKG_VERSION = '1.1.8'
  var PKG_FORMAT = 'esm'
  var g =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {}
  var crossLinkedDocs = 'https://liveblocks.io/docs/errors/cross-linked'
  var dupesDocs = 'https://liveblocks.io/docs/errors/dupes'
  var SPACE = ' '
  function error(msg) {
    if (false) {
      console.error(msg)
    } else {
      throw new Error(msg)
    }
  }
  function detectDupes(pkgName, pkgVersion, pkgFormat) {
    const pkgId = Symbol.for(pkgName)
    const pkgBuildInfo = pkgFormat
      ? `${pkgVersion || 'dev'} (${pkgFormat})`
      : pkgVersion || 'dev'
    if (!g[pkgId]) {
      g[pkgId] = pkgBuildInfo
    } else if (g[pkgId] === pkgBuildInfo) {
    } else {
      const msg = [
        `Multiple copies of Liveblocks are being loaded in your project. This will cause issues! See ${
          dupesDocs + SPACE
        }`,
        '',
        'Conflicts:',
        `- ${pkgName} ${g[pkgId]} (already loaded)`,
        `- ${pkgName} ${pkgBuildInfo} (trying to load this now)`
      ].join('\n')
      error(msg)
    }
    if (pkgVersion && PKG_VERSION && pkgVersion !== PKG_VERSION) {
      error(
        [
          `Cross-linked versions of Liveblocks found, which will cause issues! See ${
            crossLinkedDocs + SPACE
          }`,
          '',
          'Conflicts:',
          `- ${PKG_NAME} is at ${PKG_VERSION}`,
          `- ${pkgName} is at ${pkgVersion}`,
          '',
          'Always upgrade all Liveblocks packages to the same version number.'
        ].join('\n')
      )
    }
  }
  function makeEventSource() {
    const _onetimeObservers = /* @__PURE__ */ new Set()
    const _observers = /* @__PURE__ */ new Set()
    let _buffer = null
    function pause() {
      _buffer = []
    }
    function unpause() {
      if (_buffer === null) {
        return
      }
      for (const event of _buffer) {
        notify(event)
      }
      _buffer = null
    }
    function subscribe(callback) {
      _observers.add(callback)
      return () => _observers.delete(callback)
    }
    function subscribeOnce(callback) {
      _onetimeObservers.add(callback)
      return () => _onetimeObservers.delete(callback)
    }
    async function waitUntil(predicate) {
      let unsub
      return new Promise(res => {
        unsub = subscribe(event => {
          if (predicate === void 0 || predicate(event)) {
            res(event)
          }
        })
      }).finally(() => unsub?.())
    }
    function notifyOrBuffer(event) {
      if (_buffer !== null) {
        _buffer.push(event)
      } else {
        notify(event)
      }
    }
    function notify(event) {
      _onetimeObservers.forEach(callback => callback(event))
      _onetimeObservers.clear()
      _observers.forEach(callback => callback(event))
    }
    function clear() {
      _onetimeObservers.clear()
      _observers.clear()
    }
    function count() {
      return _onetimeObservers.size + _observers.size
    }
    return {
      // Private/internal control over event emission
      notify: notifyOrBuffer,
      subscribe,
      subscribeOnce,
      clear,
      count,
      waitUntil,
      pause,
      unpause,
      // Publicly exposable subscription API
      observable: {
        subscribe,
        subscribeOnce,
        waitUntil
      }
    }
  }
  var _bridgeActive = false
  function activateBridge(allowed) {
    _bridgeActive = allowed
  }
  function sendToPanel(message, options) {
    if (typeof window === 'undefined') {
      return
    }
    const fullMsg = {
      ...message,
      source: 'liveblocks-devtools-client'
    }
    if (!(options?.force || _bridgeActive)) {
      return
    }
    window.postMessage(fullMsg, '*')
  }
  var eventSource = makeEventSource()
  if (typeof window !== 'undefined') {
    window.addEventListener('message', event => {
      if (
        event.source === window &&
        event.data?.source === 'liveblocks-devtools-panel'
      ) {
        eventSource.notify(event.data)
      } else {
      }
    })
  }
  var onMessageFromPanel = eventSource.observable
  var VERSION = PKG_VERSION || 'dev'
  var _devtoolsSetupHasRun = false
  function setupDevTools(getAllRooms) {
    if (typeof window === 'undefined') {
      return
    }
    if (_devtoolsSetupHasRun) {
      return
    }
    _devtoolsSetupHasRun = true
    onMessageFromPanel.subscribe(msg => {
      switch (msg.msg) {
        case 'connect': {
          activateBridge(true)
          for (const roomId of getAllRooms()) {
            sendToPanel({
              msg: 'room::available',
              roomId,
              clientVersion: VERSION
            })
          }
          break
        }
      }
    })
    sendToPanel({ msg: 'wake-up-devtools' }, { force: true })
  }
  var unsubsByRoomId = /* @__PURE__ */ new Map()
  function stopSyncStream(roomId) {
    const unsubs = unsubsByRoomId.get(roomId) ?? []
    unsubsByRoomId.delete(roomId)
    for (const unsub of unsubs) {
      unsub()
    }
  }
  function startSyncStream(room) {
    stopSyncStream(room.id)
    fullSync(room)
    unsubsByRoomId.set(room.id, [
      // When the connection status changes
      room.events.status.subscribe(() => partialSyncConnection(room)),
      // When storage initializes, send the update
      room.events.storageDidLoad.subscribeOnce(() => partialSyncStorage(room)),
      // Any time storage updates, send the new storage root
      room.events.storage.subscribe(() => partialSyncStorage(room)),
      // Any time "me" or "others" updates, send the new values accordingly
      room.events.self.subscribe(() => partialSyncMe(room)),
      room.events.others.subscribe(() => partialSyncOthers(room))
    ])
  }
  function partialSyncConnection(room) {
    sendToPanel({
      msg: 'room::sync::partial',
      roomId: room.id,
      status: room.getStatus()
    })
  }
  function partialSyncStorage(room) {
    const root = room.getStorageSnapshot()
    if (root) {
      sendToPanel({
        msg: 'room::sync::partial',
        roomId: room.id,
        storage: root.toTreeNode('root').payload
      })
    }
  }
  function partialSyncMe(room) {
    const me = room.__internal.getSelf_forDevTools()
    if (me) {
      sendToPanel({
        msg: 'room::sync::partial',
        roomId: room.id,
        me
      })
    }
  }
  function partialSyncOthers(room) {
    const others = room.__internal.getOthers_forDevTools()
    if (others) {
      sendToPanel({
        msg: 'room::sync::partial',
        roomId: room.id,
        others
      })
    }
  }
  function fullSync(room) {
    const root = room.getStorageSnapshot()
    const me = room.__internal.getSelf_forDevTools()
    const others = room.__internal.getOthers_forDevTools()
    sendToPanel({
      msg: 'room::sync::full',
      roomId: room.id,
      status: room.getStatus(),
      storage: root?.toTreeNode('root').payload ?? null,
      me,
      others
    })
  }
  var roomChannelListeners = /* @__PURE__ */ new Map()
  function stopRoomChannelListener(roomId) {
    const listener = roomChannelListeners.get(roomId)
    roomChannelListeners.delete(roomId)
    if (listener) {
      listener()
    }
  }
  function linkDevTools(roomId, room) {
    if (typeof window === 'undefined') {
      return
    }
    sendToPanel({ msg: 'room::available', roomId, clientVersion: VERSION })
    stopRoomChannelListener(roomId)
    roomChannelListeners.set(
      roomId,
      // Returns the unsubscribe callback, that we store in the
      // roomChannelListeners registry
      onMessageFromPanel.subscribe(msg => {
        switch (msg.msg) {
          case 'room::subscribe': {
            if (msg.roomId === roomId) {
              startSyncStream(room)
            }
            break
          }
          case 'room::unsubscribe': {
            if (msg.roomId === roomId) {
              stopSyncStream(roomId)
            }
            break
          }
        }
      })
    )
  }
  function unlinkDevTools(roomId) {
    if (typeof window === 'undefined') {
      return
    }
    stopSyncStream(roomId)
    stopRoomChannelListener(roomId)
    sendToPanel({
      msg: 'room::unavailable',
      roomId
    })
  }
  var badge =
    'background:#0e0d12;border-radius:9999px;color:#fff;padding:3px 7px;font-family:sans-serif;font-weight:600;'
  var bold = 'font-weight:600'
  function wrap(method) {
    return typeof window === 'undefined' || false
      ? console[method]
      : /* istanbul ignore next */
        (message, ...args) =>
          console[method]('%cLiveblocks', badge, message, ...args)
  }
  var warn = wrap('warn')
  var error2 = wrap('error')
  function wrapWithTitle(method) {
    return typeof window === 'undefined' || false
      ? console[method]
      : /* istanbul ignore next */
        (title, message, ...args) =>
          console[method](
            `%cLiveblocks%c ${title}`,
            badge,
            bold,
            message,
            ...args
          )
  }
  var warnWithTitle = wrapWithTitle('warn')
  var errorWithTitle = wrapWithTitle('error')
  var _emittedDeprecationWarnings = /* @__PURE__ */ new Set()
  function deprecate(message, key = message) {
    if (true) {
      if (!_emittedDeprecationWarnings.has(key)) {
        _emittedDeprecationWarnings.add(key)
        errorWithTitle('Deprecation warning', message)
      }
    }
  }
  function deprecateIf(condition, message, key = message) {
    if (true) {
      if (condition) {
        deprecate(message, key)
      }
    }
  }
  function assertNever(_value, errmsg) {
    throw new Error(errmsg)
  }
  function assert(condition, errmsg) {
    if (true) {
      if (!condition) {
        const err = new Error(errmsg)
        err.name = 'Assertion failure'
        throw err
      }
    }
  }
  function nn(value, errmsg = 'Expected value to be non-nullable') {
    assert(value !== null && value !== void 0, errmsg)
    return value
  }
  function distance(state1, state2) {
    if (state1 === state2) {
      return [0, 0]
    }
    const chunks1 = state1.split('.')
    const chunks2 = state2.split('.')
    const minLen = Math.min(chunks1.length, chunks2.length)
    let shared = 0
    for (; shared < minLen; shared++) {
      if (chunks1[shared] !== chunks2[shared]) {
        break
      }
    }
    const up = chunks1.length - shared
    const down = chunks2.length - shared
    return [up, down]
  }
  function patterns(targetState, levels) {
    const parts = targetState.split('.')
    if (levels < 1 || levels > parts.length + 1) {
      throw new Error('Invalid number of levels')
    }
    const result = []
    if (levels > parts.length) {
      result.push('*')
    }
    for (let i = parts.length - levels + 1; i < parts.length; i++) {
      const slice = parts.slice(0, i)
      if (slice.length > 0) {
        result.push(slice.join('.') + '.*')
      }
    }
    result.push(targetState)
    return result
  }
  var SafeContext = class {
    constructor(initialContext) {
      this.curr = initialContext
    }
    get current() {
      return this.curr
    }
    /**
     * Call a callback function that allows patching of the context, by
     * calling `context.patch()`. Patching is only allowed for the duration
     * of this window.
     */
    allowPatching(callback) {
      const self = this
      let allowed = true
      const patchableContext = {
        ...this.curr,
        patch(patch) {
          if (allowed) {
            self.curr = Object.assign({}, self.curr, patch)
            for (const pair of Object.entries(patch)) {
              const [key, value] = pair
              if (key !== 'patch') {
                this[key] = value
              }
            }
          } else {
            throw new Error('Can no longer patch stale context')
          }
        }
      }
      callback(patchableContext)
      allowed = false
      return
    }
  }
  var nextId = 1
  var FSM = class {
    /**
     * Returns the initial state, which is defined by the first call made to
     * .addState().
     */
    get initialState() {
      const result = this.states.values()[Symbol.iterator]().next()
      if (result.done) {
        throw new Error('No states defined yet')
      } else {
        return result.value
      }
    }
    get currentState() {
      if (this.currentStateOrNull === null) {
        if (this.runningState === 0) {
          throw new Error('Not started yet')
        } else {
          throw new Error('Already stopped')
        }
      }
      return this.currentStateOrNull
    }
    /**
     * Starts the machine by entering the initial state.
     */
    start() {
      if (this.runningState !== 0) {
        throw new Error('State machine has already started')
      }
      this.runningState = 1
      this.currentStateOrNull = this.initialState
      this.enter(null)
      return this
    }
    /**
     * Stops the state machine. Stopping the state machine will call exit
     * handlers for the current state, but not enter a new state.
     */
    stop() {
      if (this.runningState !== 1) {
        throw new Error("Cannot stop a state machine that hasn't started yet")
      }
      this.exit(null)
      this.runningState = 2
      this.currentStateOrNull = null
    }
    constructor(initialContext) {
      this.id = nextId++
      this.runningState = 0
      this.currentStateOrNull = null
      this.states = /* @__PURE__ */ new Set()
      this.enterFns = /* @__PURE__ */ new Map()
      this.cleanupStack = []
      this.knownEventTypes = /* @__PURE__ */ new Set()
      this.allowedTransitions = /* @__PURE__ */ new Map()
      this.currentContext = new SafeContext(initialContext)
      this.eventHub = {
        didReceiveEvent: makeEventSource(),
        willTransition: makeEventSource(),
        didIgnoreEvent: makeEventSource(),
        willExitState: makeEventSource(),
        didEnterState: makeEventSource()
      }
      this.events = {
        didReceiveEvent: this.eventHub.didReceiveEvent.observable,
        willTransition: this.eventHub.willTransition.observable,
        didIgnoreEvent: this.eventHub.didIgnoreEvent.observable,
        willExitState: this.eventHub.willExitState.observable,
        didEnterState: this.eventHub.didEnterState.observable
      }
    }
    get context() {
      return this.currentContext.current
    }
    /**
     * Define an explicit finite state in the state machine.
     */
    addState(state) {
      if (this.runningState !== 0) {
        throw new Error('Already started')
      }
      this.states.add(state)
      return this
    }
    onEnter(nameOrPattern, enterFn) {
      if (this.runningState !== 0) {
        throw new Error('Already started')
      } else if (this.enterFns.has(nameOrPattern)) {
        throw new Error(
          // TODO We _currently_ don't support multiple .onEnters() for the same
          // state, but this is not a fundamental limitation. Just not
          // implemented yet. If we wanted to, we could make this an array.
          `enter/exit function for ${nameOrPattern} already exists`
        )
      }
      this.enterFns.set(nameOrPattern, enterFn)
      return this
    }
    onEnterAsync(nameOrPattern, promiseFn, onOK, onError) {
      return this.onEnter(nameOrPattern, () => {
        let cancelled = false
        void promiseFn(this.currentContext.current).then(
          // On OK
          data => {
            if (!cancelled) {
              this.transition({ type: 'ASYNC_OK', data }, onOK)
            }
          },
          // On Error
          reason => {
            if (!cancelled) {
              this.transition({ type: 'ASYNC_ERROR', reason }, onError)
            }
          }
        )
        return () => {
          cancelled = true
        }
      })
    }
    getStatesMatching(nameOrPattern) {
      const matches = []
      if (nameOrPattern === '*') {
        for (const state of this.states) {
          matches.push(state)
        }
      } else if (nameOrPattern.endsWith('.*')) {
        const prefix = nameOrPattern.slice(0, -1)
        for (const state of this.states) {
          if (state.startsWith(prefix)) {
            matches.push(state)
          }
        }
      } else {
        const name = nameOrPattern
        if (this.states.has(name)) {
          matches.push(name)
        }
      }
      if (matches.length === 0) {
        throw new Error(`No states match ${JSON.stringify(nameOrPattern)}`)
      }
      return matches
    }
    /**
     * Define all allowed outgoing transitions for a state.
     *
     * The targets for each event can be defined as a function which returns the
     * next state to transition to. These functions can look at the `event` or
     * `context` params to conditionally decide which next state to transition
     * to.
     *
     * If you set it to `null`, then the transition will be explicitly forbidden
     * and throw an error. If you don't define a target for a transition, then
     * such events will get ignored.
     */
    addTransitions(nameOrPattern, mapping) {
      if (this.runningState !== 0) {
        throw new Error('Already started')
      }
      for (const srcState of this.getStatesMatching(nameOrPattern)) {
        let map = this.allowedTransitions.get(srcState)
        if (map === void 0) {
          map = /* @__PURE__ */ new Map()
          this.allowedTransitions.set(srcState, map)
        }
        for (const [type, target_] of Object.entries(mapping)) {
          if (map.has(type)) {
            throw new Error(
              `Trying to set transition "${type}" on "${srcState}" (via "${nameOrPattern}"), but a transition already exists there.`
            )
          }
          const target = target_
          this.knownEventTypes.add(type)
          if (target !== void 0) {
            const targetFn =
              typeof target === 'function' ? target : () => target
            map.set(type, targetFn)
          }
        }
      }
      return this
    }
    /**
     * Like `.addTransition()`, but takes an (anonymous) transition whenever the
     * timer fires.
     *
     * @param stateOrPattern The state name, or state group pattern name.
     * @param after          Number of milliseconds after which to take the
     *                       transition. If in the mean time, another transition
     *                       is taken, the timer will get cancelled.
     * @param target     The target state to go to.
     */
    addTimedTransition(stateOrPattern, after2, target) {
      return this.onEnter(stateOrPattern, () => {
        const ms =
          typeof after2 === 'function'
            ? after2(this.currentContext.current)
            : after2
        const timeoutID = setTimeout(() => {
          this.transition({ type: 'TIMER' }, target)
        }, ms)
        return () => {
          clearTimeout(timeoutID)
        }
      })
    }
    getTargetFn(eventName) {
      return this.allowedTransitions.get(this.currentState)?.get(eventName)
    }
    /**
     * Exits the current state, and executes any necessary cleanup functions.
     * Call this before changing the current state to the next state.
     *
     * @param levels Defines how many "levels" of nesting will be
     * exited. For example, if you transition from `foo.bar.qux` to
     * `foo.bar.baz`, then the level is 1. But if you transition from
     * `foo.bar.qux` to `bla.bla`, then the level is 3.
     * If `null`, it will exit all levels.
     */
    exit(levels) {
      this.eventHub.willExitState.notify(this.currentState)
      this.currentContext.allowPatching(patchableContext => {
        levels = levels ?? this.cleanupStack.length
        for (let i = 0; i < levels; i++) {
          this.cleanupStack.pop()?.(patchableContext)
        }
      })
    }
    /**
     * Enters the current state, and executes any necessary onEnter handlers.
     * Call this directly _after_ setting the current state to the next state.
     */
    enter(levels) {
      const enterPatterns = patterns(
        this.currentState,
        levels ?? this.currentState.split('.').length + 1
      )
      this.currentContext.allowPatching(patchableContext => {
        for (const pattern of enterPatterns) {
          const enterFn = this.enterFns.get(pattern)
          const cleanupFn = enterFn?.(patchableContext)
          if (typeof cleanupFn === 'function') {
            this.cleanupStack.push(cleanupFn)
          } else {
            this.cleanupStack.push(null)
          }
        }
      })
      this.eventHub.didEnterState.notify(this.currentState)
    }
    /**
     * Sends an event to the machine, which may cause an internal state
     * transition to happen. When that happens, will trigger side effects.
     */
    send(event) {
      if (!this.knownEventTypes.has(event.type)) {
        throw new Error(`Invalid event ${JSON.stringify(event.type)}`)
      }
      if (this.runningState === 2) {
        return
      }
      const targetFn = this.getTargetFn(event.type)
      if (targetFn !== void 0) {
        return this.transition(event, targetFn)
      } else {
        this.eventHub.didIgnoreEvent.notify(event)
      }
    }
    transition(event, target) {
      this.eventHub.didReceiveEvent.notify(event)
      const oldState = this.currentState
      const targetFn = typeof target === 'function' ? target : () => target
      const nextTarget = targetFn(event, this.currentContext.current)
      let nextState
      let effects = void 0
      if (nextTarget === null) {
        this.eventHub.didIgnoreEvent.notify(event)
        return
      }
      if (typeof nextTarget === 'string') {
        nextState = nextTarget
      } else {
        nextState = nextTarget.target
        effects = Array.isArray(nextTarget.effect)
          ? nextTarget.effect
          : [nextTarget.effect]
      }
      if (!this.states.has(nextState)) {
        throw new Error(`Invalid next state name: ${JSON.stringify(nextState)}`)
      }
      this.eventHub.willTransition.notify({ from: oldState, to: nextState })
      const [up, down] = distance(this.currentState, nextState)
      if (up > 0) {
        this.exit(up)
      }
      this.currentStateOrNull = nextState
      if (effects !== void 0) {
        const effectsToRun = effects
        this.currentContext.allowPatching(patchableContext => {
          for (const effect of effectsToRun) {
            if (typeof effect === 'function') {
              effect(patchableContext, event)
            } else {
              patchableContext.patch(effect)
            }
          }
        })
      }
      if (down > 0) {
        this.enter(down)
      }
    }
  }
  function isPlainObject(blob) {
    return (
      blob !== null &&
      typeof blob === 'object' &&
      Object.prototype.toString.call(blob) === '[object Object]'
    )
  }
  function entries(obj) {
    return Object.entries(obj)
  }
  function tryParseJson(rawMessage) {
    try {
      return JSON.parse(rawMessage)
    } catch (e) {
      return void 0
    }
  }
  function deepClone(items) {
    return JSON.parse(JSON.stringify(items))
  }
  function b64decode(b64value) {
    try {
      const formattedValue = b64value.replace(/-/g, '+').replace(/_/g, '/')
      const decodedValue = decodeURIComponent(
        atob(formattedValue)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join('')
      )
      return decodedValue
    } catch (err) {
      return atob(b64value)
    }
  }
  function compact(items) {
    return items.filter(item => item !== null && item !== void 0)
  }
  function compactObject(obj) {
    const newObj = { ...obj }
    Object.keys(obj).forEach(k => {
      const key = k
      if (newObj[key] === void 0) {
        delete newObj[key]
      }
    })
    return newObj
  }
  async function withTimeout(promise, millis, errmsg = 'Timed out') {
    let timerID
    const timer$ = new Promise((_, reject) => {
      timerID = setTimeout(() => {
        reject(new Error(errmsg))
      }, millis)
    })
    return Promise.race([promise, timer$]).finally(() => clearTimeout(timerID))
  }
  function newToLegacyStatus(status) {
    switch (status) {
      case 'connecting':
        return 'connecting'
      case 'connected':
        return 'open'
      case 'reconnecting':
        return 'unavailable'
      case 'disconnected':
        return 'failed'
      case 'initial':
        return 'closed'
      default:
        return 'closed'
    }
  }
  function toNewConnectionStatus(machine) {
    const state = machine.currentState
    switch (state) {
      case '@ok.connected':
      case '@ok.awaiting-pong':
        return 'connected'
      case '@idle.initial':
        return 'initial'
      case '@auth.busy':
      case '@auth.backoff':
      case '@connecting.busy':
      case '@connecting.backoff':
        return machine.context.successCount > 0 ? 'reconnecting' : 'connecting'
      case '@idle.failed':
        return 'disconnected'
      default:
        return assertNever(state, 'Unknown state')
    }
  }
  var BACKOFF_DELAYS = [250, 500, 1e3, 2e3, 4e3, 8e3, 1e4]
  var RESET_DELAY = BACKOFF_DELAYS[0] - 1
  var BACKOFF_DELAYS_SLOW = [2e3, 3e4, 6e4, 3e5]
  var HEARTBEAT_INTERVAL = 3e4
  var PONG_TIMEOUT = 2e3
  var AUTH_TIMEOUT = 1e4
  var SOCKET_CONNECT_TIMEOUT = 1e4
  var StopRetrying = class extends Error {
    constructor(reason) {
      super(reason)
    }
  }
  var LiveblocksError = class extends Error {
    constructor(message, code) {
      super(message)
      this.code = code
    }
  }
  function nextBackoffDelay(currentDelay, delays = BACKOFF_DELAYS) {
    return (
      delays.find(delay => delay > currentDelay) ?? delays[delays.length - 1]
    )
  }
  function increaseBackoffDelay(context) {
    context.patch({ backoffDelay: nextBackoffDelay(context.backoffDelay) })
  }
  function increaseBackoffDelayAggressively(context) {
    context.patch({
      backoffDelay: nextBackoffDelay(context.backoffDelay, BACKOFF_DELAYS_SLOW)
    })
  }
  function resetSuccessCount(context) {
    context.patch({ successCount: 0 })
  }
  function log(level, message) {
    const logger =
      level === 2
        ? error2
        : level === 1
        ? warn
        : /* black hole */
          () => {}
    return () => {
      logger(message)
    }
  }
  function logPrematureErrorOrCloseEvent(e) {
    const conn = 'Connection to Liveblocks websocket server'
    return ctx => {
      if (e instanceof Error) {
        warn(`${conn} could not be established. ${String(e)}`)
      } else {
        warn(
          isCloseEvent(e)
            ? `${conn} closed prematurely (code: ${e.code}). Retrying in ${ctx.backoffDelay}ms.`
            : `${conn} could not be established.`
        )
      }
    }
  }
  function logCloseEvent(event) {
    return ctx => {
      warn(
        `Connection to Liveblocks websocket server closed (code: ${event.code}). Retrying in ${ctx.backoffDelay}ms.`
      )
    }
  }
  var logPermanentClose = log(
    1,
    "Connection to WebSocket closed permanently. Won't retry."
  )
  function isCloseEvent(error3) {
    return !(error3 instanceof Error) && error3.type === 'close'
  }
  function isCustomCloseEvent(error3) {
    return isCloseEvent(error3) && error3.code >= 4e3 && error3.code < 4100
  }
  function enableTracing(machine) {
    const start = /* @__PURE__ */ new Date().getTime()
    function log2(...args) {
      warn(
        `${((/* @__PURE__ */ new Date().getTime() - start) / 1e3).toFixed(
          2
        )} [FSM #${machine.id}]`,
        ...args
      )
    }
    const unsubs = [
      machine.events.didReceiveEvent.subscribe(e => log2(`Event ${e.type}`)),
      machine.events.willTransition.subscribe(({ from, to }) =>
        log2('Transitioning', from, '\u2192', to)
      ),
      machine.events.didIgnoreEvent.subscribe(e =>
        log2('Ignored event', e.type, e, "(current state won't handle it)")
      )
      // machine.events.willExitState.subscribe((s) => log("Exiting state", s)),
      // machine.events.didEnterState.subscribe((s) => log("Entering state", s)),
    ]
    return () => {
      for (const unsub of unsubs) {
        unsub()
      }
    }
  }
  function defineConnectivityEvents(machine) {
    const statusDidChange = makeEventSource()
    const didConnect = makeEventSource()
    const didDisconnect = makeEventSource()
    let lastStatus = null
    const unsubscribe = machine.events.didEnterState.subscribe(() => {
      const currStatus = toNewConnectionStatus(machine)
      if (currStatus !== lastStatus) {
        statusDidChange.notify(currStatus)
      }
      if (lastStatus === 'connected' && currStatus !== 'connected') {
        didDisconnect.notify()
      } else if (lastStatus !== 'connected' && currStatus === 'connected') {
        didConnect.notify()
      }
      lastStatus = currStatus
    })
    return {
      statusDidChange: statusDidChange.observable,
      didConnect: didConnect.observable,
      didDisconnect: didDisconnect.observable,
      unsubscribe
    }
  }
  var assign = patch => ctx => ctx.patch(patch)
  function createConnectionStateMachine(delegates, enableDebugLogging) {
    const onMessage = makeEventSource()
    onMessage.pause()
    const onLiveblocksError = makeEventSource()
    const initialContext = {
      successCount: 0,
      token: null,
      socket: null,
      backoffDelay: RESET_DELAY
    }
    const machine = new FSM(initialContext)
      .addState('@idle.initial')
      .addState('@idle.failed')
      .addState('@auth.busy')
      .addState('@auth.backoff')
      .addState('@connecting.busy')
      .addState('@connecting.backoff')
      .addState('@ok.connected')
      .addState('@ok.awaiting-pong')
    machine.addTransitions('*', {
      RECONNECT: {
        target: '@auth.backoff',
        effect: [increaseBackoffDelay, resetSuccessCount]
      },
      DISCONNECT: '@idle.initial'
    })
    machine.onEnter('@idle.*', resetSuccessCount).addTransitions('@idle.*', {
      CONNECT: (_, ctx) =>
        // If we still have a known token, try to reconnect to the socket directly,
        // otherwise, try to obtain a new token
        ctx.token !== null ? '@connecting.busy' : '@auth.busy'
    })
    machine
      .addTransitions('@auth.backoff', {
        NAVIGATOR_ONLINE: {
          target: '@auth.busy',
          effect: assign({ backoffDelay: RESET_DELAY })
        }
      })
      .addTimedTransition(
        '@auth.backoff',
        ctx => ctx.backoffDelay,
        '@auth.busy'
      )
      .onEnterAsync(
        '@auth.busy',
        () => withTimeout(delegates.authenticate(), AUTH_TIMEOUT),
        // On successful authentication
        okEvent => ({
          target: '@connecting.busy',
          effect: assign({
            token: okEvent.data,
            backoffDelay: RESET_DELAY
          })
        }),
        // Auth failed
        failedEvent => {
          if (failedEvent.reason instanceof StopRetrying) {
            return {
              target: '@idle.failed',
              effect: log(2, failedEvent.reason.message)
            }
          }
          return {
            target: '@auth.backoff',
            effect: [
              increaseBackoffDelay,
              log(
                2,
                `Authentication failed: ${
                  failedEvent.reason instanceof Error
                    ? failedEvent.reason.message
                    : String(failedEvent.reason)
                }`
              )
            ]
          }
        }
      )
    const onSocketError = event =>
      machine.send({ type: 'EXPLICIT_SOCKET_ERROR', event })
    const onSocketClose = event =>
      machine.send({ type: 'EXPLICIT_SOCKET_CLOSE', event })
    const onSocketMessage = event =>
      event.data === 'pong'
        ? machine.send({ type: 'PONG' })
        : onMessage.notify(event)
    function teardownSocket(socket) {
      if (socket) {
        socket.removeEventListener('error', onSocketError)
        socket.removeEventListener('close', onSocketClose)
        socket.removeEventListener('message', onSocketMessage)
        socket.close()
      }
    }
    machine
      .addTransitions('@connecting.backoff', {
        NAVIGATOR_ONLINE: {
          target: '@connecting.busy',
          effect: assign({ backoffDelay: RESET_DELAY })
        }
      })
      .addTimedTransition(
        '@connecting.backoff',
        ctx => ctx.backoffDelay,
        '@connecting.busy'
      )
      .onEnterAsync(
        '@connecting.busy',
        //
        // Use the "createSocket" delegate function (provided to the
        // ManagedSocket) to create the actual WebSocket connection instance.
        // Then, set up all the necessary event listeners, and wait for the
        // "open" event to occur.
        //
        // When the "open" event happens, we're ready to transition to the
        // OK state. This is done by resolving the Promise.
        //
        async ctx => {
          let capturedPrematureEvent = null
          const connect$ = new Promise((resolve, rej) => {
            if (ctx.token === null) {
              throw new Error('No auth token')
            }
            const socket = delegates.createSocket(ctx.token)
            function reject(event) {
              capturedPrematureEvent = event
              socket.removeEventListener('message', onSocketMessage)
              rej(event)
            }
            socket.addEventListener('message', onSocketMessage)
            socket.addEventListener('error', reject)
            socket.addEventListener('close', reject)
            socket.addEventListener('open', () => {
              socket.addEventListener('error', onSocketError)
              socket.addEventListener('close', onSocketClose)
              const unsub = () => {
                socket.removeEventListener('error', reject)
                socket.removeEventListener('close', reject)
              }
              resolve([socket, unsub])
            })
          })
          return withTimeout(connect$, SOCKET_CONNECT_TIMEOUT).then(
            //
            // Part 3:
            // By now, our "open" event has fired, and the promise has been
            // resolved. Two possible scenarios:
            //
            // 1. The happy path. Most likely.
            // 2. Uh-oh. A premature close/error event has been observed. Let's
            //    reject the promise after all.
            //
            // Any close/error event that will get scheduled after this point
            // onwards, will be caught in the OK state, and dealt with
            // accordingly.
            //
            ([socket, unsub]) => {
              unsub()
              if (capturedPrematureEvent) {
                throw capturedPrematureEvent
              }
              return socket
            }
          )
        },
        // Only transition to OK state after a successfully opened WebSocket connection
        okEvent => ({
          target: '@ok.connected',
          effect: assign({
            socket: okEvent.data,
            backoffDelay: RESET_DELAY
          })
        }),
        // If the WebSocket connection cannot be established
        failure => {
          const err = failure.reason
          if (err instanceof StopRetrying) {
            return {
              target: '@idle.failed',
              effect: log(2, err.message)
            }
          }
          if (isCloseEvent(err) && err.code === 4999) {
            return {
              target: '@idle.failed',
              effect: log(2, err.reason)
            }
          }
          if (isCustomCloseEvent(err) && err.code !== 4001) {
            return {
              target: '@connecting.backoff',
              effect: [
                increaseBackoffDelayAggressively,
                logPrematureErrorOrCloseEvent(err)
              ]
            }
          }
          return {
            target: '@auth.backoff',
            effect: [increaseBackoffDelay, logPrematureErrorOrCloseEvent(err)]
          }
        }
      )
    const sendHeartbeat = {
      target: '@ok.awaiting-pong',
      effect: ctx => {
        ctx.socket?.send('ping')
      }
    }
    machine
      .addTimedTransition('@ok.connected', HEARTBEAT_INTERVAL, sendHeartbeat)
      .addTransitions('@ok.connected', {
        NAVIGATOR_OFFLINE: sendHeartbeat,
        // Don't take the browser's word for it when it says it's offline. Do a ping/pong to make sure.
        WINDOW_GOT_FOCUS: sendHeartbeat
      })
    machine
      .onEnter('@ok.*', ctx => {
        ctx.patch({ successCount: ctx.successCount + 1 })
        const timerID = setTimeout(
          // On the next tick, start delivering all messages that have already
          // been received, and continue synchronous delivery of all future
          // incoming messages.
          onMessage.unpause,
          0
        )
        return ctx2 => {
          teardownSocket(ctx2.socket)
          ctx2.patch({ socket: null })
          clearTimeout(timerID)
          onMessage.pause()
        }
      })
      .addTransitions('@ok.awaiting-pong', { PONG: '@ok.connected' })
      .addTimedTransition('@ok.awaiting-pong', PONG_TIMEOUT, {
        target: '@connecting.busy',
        // Log implicit connection loss and drop the current open socket
        effect: log(
          1,
          'Received no pong from server, assume implicit connection loss.'
        )
      })
      .addTransitions('@ok.*', {
        // When a socket receives an error, this can cause the closing of the
        // socket, or not. So always check to see if the socket is still OPEN or
        // not. When still OPEN, don't transition.
        EXPLICIT_SOCKET_ERROR: (_, context) => {
          if (context.socket?.readyState === 1) {
            return null
          }
          return {
            target: '@connecting.backoff',
            effect: increaseBackoffDelay
          }
        },
        EXPLICIT_SOCKET_CLOSE: e => {
          if (e.event.code === 4999) {
            return {
              target: '@idle.failed',
              effect: logPermanentClose
            }
          }
          if (e.event.code === 4001) {
            return {
              target: '@auth.backoff',
              effect: [increaseBackoffDelay, logCloseEvent(e.event)]
            }
          }
          if (isCustomCloseEvent(e.event)) {
            return {
              target: '@connecting.backoff',
              effect: [
                increaseBackoffDelayAggressively,
                logCloseEvent(e.event),
                () => {
                  const err = new LiveblocksError(e.event.reason, e.event.code)
                  onLiveblocksError.notify(err)
                }
              ]
            }
          }
          return {
            target: '@connecting.backoff',
            effect: [increaseBackoffDelay, logCloseEvent(e.event)]
          }
        }
      })
    if (typeof document !== 'undefined') {
      const doc = typeof document !== 'undefined' ? document : void 0
      const win = typeof window !== 'undefined' ? window : void 0
      const root = win ?? doc
      machine.onEnter('*', ctx => {
        function onNetworkOffline() {
          machine.send({ type: 'NAVIGATOR_OFFLINE' })
        }
        function onNetworkBackOnline() {
          machine.send({ type: 'NAVIGATOR_ONLINE' })
        }
        function onVisibilityChange() {
          if (doc?.visibilityState === 'visible') {
            machine.send({ type: 'WINDOW_GOT_FOCUS' })
          }
        }
        win?.addEventListener('online', onNetworkBackOnline)
        win?.addEventListener('offline', onNetworkOffline)
        root?.addEventListener('visibilitychange', onVisibilityChange)
        return () => {
          root?.removeEventListener('visibilitychange', onVisibilityChange)
          win?.removeEventListener('online', onNetworkBackOnline)
          win?.removeEventListener('offline', onNetworkOffline)
          teardownSocket(ctx.socket)
        }
      })
    }
    const cleanups = []
    const { statusDidChange, didConnect, didDisconnect, unsubscribe } =
      defineConnectivityEvents(machine)
    cleanups.push(unsubscribe)
    if (enableDebugLogging) {
      cleanups.push(enableTracing(machine))
    }
    machine.start()
    return {
      machine,
      cleanups,
      // Observable events that will be emitted by this machine
      events: {
        statusDidChange,
        didConnect,
        didDisconnect,
        onMessage: onMessage.observable,
        onLiveblocksError: onLiveblocksError.observable
      }
    }
  }
  var ManagedSocket = class {
    constructor(delegates, enableDebugLogging = false) {
      const { machine, events, cleanups } = createConnectionStateMachine(
        delegates,
        enableDebugLogging
      )
      this.machine = machine
      this.events = events
      this.cleanups = cleanups
    }
    getLegacyStatus() {
      return newToLegacyStatus(this.getStatus())
    }
    getStatus() {
      try {
        return toNewConnectionStatus(this.machine)
      } catch {
        return 'initial'
      }
    }
    /**
     * Returns the current auth token.
     */
    get token() {
      return this.machine.context.token
    }
    /**
     * Call this method to try to connect to a WebSocket. This only has an effect
     * if the machine is idle at the moment, otherwise this is a no-op.
     */
    connect() {
      this.machine.send({ type: 'CONNECT' })
    }
    /**
     * If idle, will try to connect. Otherwise, it will attempt to reconnect to
     * the socket, potentially obtaining a new token first, if needed.
     */
    reconnect() {
      this.machine.send({ type: 'RECONNECT' })
    }
    /**
     * Call this method to disconnect from the current WebSocket. Is going to be
     * a no-op if there is no active connection.
     */
    disconnect() {
      this.machine.send({ type: 'DISCONNECT' })
    }
    /**
     * Call this to stop the machine and run necessary cleanup functions. After
     * calling destroy(), you can no longer use this instance. Call this before
     * letting the instance get garbage collected.
     */
    destroy() {
      this.machine.stop()
      let cleanup
      while ((cleanup = this.cleanups.pop())) {
        cleanup()
      }
    }
    /**
     * Safely send a message to the current WebSocket connection. Will emit a log
     * message if this is somehow impossible.
     */
    send(data) {
      const socket = this.machine.context?.socket
      if (socket === null) {
        warn('Cannot send: not connected yet', data)
      } else if (socket.readyState !== 1) {
        warn('Cannot send: WebSocket no longer open', data)
      } else {
        socket.send(data)
      }
    }
    /**
     * NOTE: Used by the E2E app only, to simulate explicit events.
     * Not ideal to keep exposed :(
     */
    _privateSendMachineEvent(event) {
      this.machine.send(event)
    }
  }
  var MIN_CODE = 32
  var MAX_CODE = 126
  var NUM_DIGITS = MAX_CODE - MIN_CODE + 1
  var ZERO = nthDigit(0)
  var ONE = nthDigit(1)
  var ZERO_NINE = ZERO + nthDigit(-1)
  function nthDigit(n) {
    const code = MIN_CODE + (n < 0 ? NUM_DIGITS + n : n)
    if (code < MIN_CODE || code > MAX_CODE) {
      throw new Error(`Invalid n value: ${n}`)
    }
    return String.fromCharCode(code)
  }
  function makePosition(x, y) {
    if (x !== void 0 && y !== void 0) {
      return between(x, y)
    } else if (x !== void 0) {
      return after(x)
    } else if (y !== void 0) {
      return before(y)
    } else {
      return ONE
    }
  }
  function before(pos) {
    const lastIndex = pos.length - 1
    for (let i = 0; i <= lastIndex; i++) {
      const code = pos.charCodeAt(i)
      if (code <= MIN_CODE) {
        continue
      }
      if (i === lastIndex) {
        if (code === MIN_CODE + 1) {
          return pos.substring(0, i) + ZERO_NINE
        } else {
          return pos.substring(0, i) + String.fromCharCode(code - 1)
        }
      } else {
        return pos.substring(0, i + 1)
      }
    }
    return ONE
  }
  function after(pos) {
    for (let i = 0; i <= pos.length - 1; i++) {
      const code = pos.charCodeAt(i)
      if (code >= MAX_CODE) {
        continue
      }
      return pos.substring(0, i) + String.fromCharCode(code + 1)
    }
    return pos + ONE
  }
  function between(lo, hi) {
    if (lo < hi) {
      return _between(lo, hi)
    } else if (lo > hi) {
      return _between(hi, lo)
    } else {
      throw new Error('Cannot compute value between two equal positions')
    }
  }
  function _between(lo, hi) {
    let index = 0
    const loLen = lo.length
    const hiLen = hi.length
    while (true) {
      const loCode = index < loLen ? lo.charCodeAt(index) : MIN_CODE
      const hiCode = index < hiLen ? hi.charCodeAt(index) : MAX_CODE
      if (loCode === hiCode) {
        index++
        continue
      }
      if (hiCode - loCode === 1) {
        const prefix = lo.substring(0, index + 1)
        const suffix = lo.substring(index + 1)
        const nines = ''
        return prefix + _between(suffix, nines)
      } else {
        return takeN(lo, index) + String.fromCharCode((hiCode + loCode) >> 1)
      }
    }
  }
  function takeN(pos, n) {
    return n < pos.length
      ? pos.substring(0, n)
      : pos + ZERO.repeat(n - pos.length)
  }
  var MIN_NON_ZERO_CODE = MIN_CODE + 1
  function isPos(str) {
    if (str === '') {
      return false
    }
    const lastIdx = str.length - 1
    const last = str.charCodeAt(lastIdx)
    if (last < MIN_NON_ZERO_CODE || last > MAX_CODE) {
      return false
    }
    for (let i = 0; i < lastIdx; i++) {
      const code = str.charCodeAt(i)
      if (code < MIN_CODE || code > MAX_CODE) {
        return false
      }
    }
    return true
  }
  function convertToPos(str) {
    const codes = []
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i)
      codes.push(code < MIN_CODE ? MIN_CODE : code > MAX_CODE ? MAX_CODE : code)
    }
    while (codes.length > 0 && codes[codes.length - 1] === MIN_CODE) {
      codes.length--
    }
    return codes.length > 0
      ? String.fromCharCode(...codes)
      : // Edge case: the str was a 0-only string, which is invalid. Default back to .1
        ONE
  }
  function asPos(str) {
    return isPos(str) ? str : convertToPos(str)
  }
  function isAckOp(op) {
    return op.type === 5 && op.id === 'ACK'
  }
  function crdtAsLiveNode(value) {
    return value
  }
  function HasParent(node, key, pos = asPos(key)) {
    return Object.freeze({ type: 'HasParent', node, key, pos })
  }
  var NoParent = Object.freeze({ type: 'NoParent' })
  function Orphaned(oldKey, oldPos = asPos(oldKey)) {
    return Object.freeze({ type: 'Orphaned', oldKey, oldPos })
  }
  var AbstractCrdt = class {
    constructor() {
      this._parent = NoParent
    }
    /** @internal */
    _getParentKeyOrThrow() {
      switch (this.parent.type) {
        case 'HasParent':
          return this.parent.key
        case 'NoParent':
          throw new Error('Parent key is missing')
        case 'Orphaned':
          return this.parent.oldKey
        default:
          return assertNever(this.parent, 'Unknown state')
      }
    }
    /** @internal */
    get _parentPos() {
      switch (this.parent.type) {
        case 'HasParent':
          return this.parent.pos
        case 'NoParent':
          throw new Error('Parent key is missing')
        case 'Orphaned':
          return this.parent.oldPos
        default:
          return assertNever(this.parent, 'Unknown state')
      }
    }
    /** @internal */
    get _pool() {
      return this.__pool
    }
    get roomId() {
      return this.__pool ? this.__pool.roomId : null
    }
    /** @internal */
    get _id() {
      return this.__id
    }
    /** @internal */
    get parent() {
      return this._parent
    }
    /** @internal */
    get _parentKey() {
      switch (this.parent.type) {
        case 'HasParent':
          return this.parent.key
        case 'NoParent':
          return null
        case 'Orphaned':
          return this.parent.oldKey
        default:
          return assertNever(this.parent, 'Unknown state')
      }
    }
    /** @internal */
    _apply(op, _isLocal) {
      switch (op.type) {
        case 5: {
          if (this.parent.type === 'HasParent') {
            return this.parent.node._detachChild(crdtAsLiveNode(this))
          }
          return { modified: false }
        }
      }
      return { modified: false }
    }
    /** @internal */
    _setParentLink(newParentNode, newParentKey) {
      switch (this.parent.type) {
        case 'HasParent':
          if (this.parent.node !== newParentNode) {
            throw new Error('Cannot set parent: node already has a parent')
          } else {
            this._parent = HasParent(newParentNode, newParentKey)
            return
          }
        case 'Orphaned':
        case 'NoParent': {
          this._parent = HasParent(newParentNode, newParentKey)
          return
        }
        default:
          return assertNever(this.parent, 'Unknown state')
      }
    }
    /** @internal */
    _attach(id, pool) {
      if (this.__id || this.__pool) {
        throw new Error('Cannot attach node: already attached')
      }
      pool.addNode(id, crdtAsLiveNode(this))
      this.__id = id
      this.__pool = pool
    }
    /** @internal */
    _detach() {
      if (this.__pool && this.__id) {
        this.__pool.deleteNode(this.__id)
      }
      switch (this.parent.type) {
        case 'HasParent': {
          this._parent = Orphaned(this.parent.key, this.parent.pos)
          break
        }
        case 'NoParent': {
          this._parent = NoParent
          break
        }
        case 'Orphaned': {
          break
        }
        default:
          assertNever(this.parent, 'Unknown state')
      }
      this.__pool = void 0
    }
    /**
     * @internal
     *
     * Clear the Immutable cache, so that the next call to `.toImmutable()` will
     * recompute the equivalent Immutable value again.  Call this after every
     * mutation to the Live node.
     */
    invalidate() {
      if (this._cachedImmutable !== void 0 || this._cachedTreeNode !== void 0) {
        this._cachedImmutable = void 0
        this._cachedTreeNode = void 0
        if (this.parent.type === 'HasParent') {
          this.parent.node.invalidate()
        }
      }
    }
    /**
     * @internal
     *
     * Return an snapshot of this Live tree for use in DevTools.
     */
    toTreeNode(key) {
      if (this._cachedTreeNode === void 0 || this._cachedTreeNodeKey !== key) {
        this._cachedTreeNodeKey = key
        this._cachedTreeNode = this._toTreeNode(key)
      }
      return this._cachedTreeNode
    }
    /**
     * Return an immutable snapshot of this Live node and its children.
     */
    toImmutable() {
      if (this._cachedImmutable === void 0) {
        this._cachedImmutable = this._toImmutable()
      }
      return this._cachedImmutable
    }
  }
  function isRootCrdt(crdt) {
    return crdt.type === 0 && !isChildCrdt(crdt)
  }
  function isChildCrdt(crdt) {
    return crdt.parentId !== void 0 && crdt.parentKey !== void 0
  }
  function nanoid(length = 7) {
    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,./;[]~!@#$%&*()_+=-'
    const len = alphabet.length
    return Array.from({ length }, () =>
      alphabet.charAt(Math.floor(Math.random() * len))
    ).join('')
  }
  var LiveRegister = class _LiveRegister extends AbstractCrdt {
    constructor(data) {
      super()
      this._data = data
    }
    get data() {
      return this._data
    }
    /** @internal */
    static _deserialize([id, item], _parentToChildren, pool) {
      const register = new _LiveRegister(item.data)
      register._attach(id, pool)
      return register
    }
    /** @internal */
    _toOps(parentId, parentKey, pool) {
      if (this._id === void 0) {
        throw new Error(
          'Cannot serialize register if parentId or parentKey is undefined'
        )
      }
      return [
        {
          type: 8,
          opId: pool?.generateOpId(),
          id: this._id,
          parentId,
          parentKey,
          data: this.data
        }
      ]
    }
    /** @internal */
    _serialize() {
      if (this.parent.type !== 'HasParent') {
        throw new Error('Cannot serialize LiveRegister if parent is missing')
      }
      return {
        type: 3,
        parentId: nn(this.parent.node._id, 'Parent node expected to have ID'),
        parentKey: this.parent.key,
        data: this.data
      }
    }
    /** @internal */
    _attachChild(_op) {
      throw new Error('Method not implemented.')
    }
    /** @internal */
    _detachChild(_crdt) {
      throw new Error('Method not implemented.')
    }
    /** @internal */
    _apply(op, isLocal) {
      return super._apply(op, isLocal)
    }
    /** @internal */
    _toTreeNode(key) {
      return {
        type: 'Json',
        id: this._id ?? nanoid(),
        key,
        payload: this._data
      }
    }
    /** @internal */
    _toImmutable() {
      return this._data
    }
  }
  function compareNodePosition(itemA, itemB) {
    const posA = itemA._parentPos
    const posB = itemB._parentPos
    return posA === posB ? 0 : posA < posB ? -1 : 1
  }
  var LiveList = class _LiveList extends AbstractCrdt {
    constructor(items = []) {
      super()
      this._items = []
      this._implicitlyDeletedItems = /* @__PURE__ */ new WeakSet()
      this._unacknowledgedSets = /* @__PURE__ */ new Map()
      let position = void 0
      for (const item of items) {
        const newPosition = makePosition(position)
        const node = lsonToLiveNode(item)
        node._setParentLink(this, newPosition)
        this._items.push(node)
        position = newPosition
      }
    }
    /** @internal */
    static _deserialize([id], parentToChildren, pool) {
      const list = new _LiveList()
      list._attach(id, pool)
      const children = parentToChildren.get(id)
      if (children === void 0) {
        return list
      }
      for (const [id2, crdt] of children) {
        const child = deserialize([id2, crdt], parentToChildren, pool)
        child._setParentLink(list, crdt.parentKey)
        list._insertAndSort(child)
      }
      return list
    }
    /** @internal */
    _toOps(parentId, parentKey, pool) {
      if (this._id === void 0) {
        throw new Error('Cannot serialize item is not attached')
      }
      const ops = []
      const op = {
        id: this._id,
        opId: pool?.generateOpId(),
        type: 2,
        parentId,
        parentKey
      }
      ops.push(op)
      for (const item of this._items) {
        ops.push(...item._toOps(this._id, item._getParentKeyOrThrow(), pool))
      }
      return ops
    }
    /**
     * @internal
     *
     * Adds a new item into the sorted list, in the correct position.
     */
    _insertAndSort(item) {
      this._items.push(item)
      this._sortItems()
    }
    /** @internal */
    _sortItems() {
      this._items.sort(compareNodePosition)
      this.invalidate()
    }
    /** @internal */
    _indexOfPosition(position) {
      return this._items.findIndex(
        item => item._getParentKeyOrThrow() === position
      )
    }
    /** @internal */
    _attach(id, pool) {
      super._attach(id, pool)
      for (const item of this._items) {
        item._attach(pool.generateId(), pool)
      }
    }
    /** @internal */
    _detach() {
      super._detach()
      for (const item of this._items) {
        item._detach()
      }
    }
    /** @internal */
    _applySetRemote(op) {
      if (this._pool === void 0) {
        throw new Error("Can't attach child if managed pool is not present")
      }
      const { id, parentKey: key } = op
      const child = creationOpToLiveNode(op)
      child._attach(id, this._pool)
      child._setParentLink(this, key)
      const deletedId = op.deletedId
      const indexOfItemWithSamePosition = this._indexOfPosition(key)
      if (indexOfItemWithSamePosition !== -1) {
        const itemWithSamePosition = this._items[indexOfItemWithSamePosition]
        if (itemWithSamePosition._id === deletedId) {
          itemWithSamePosition._detach()
          this._items[indexOfItemWithSamePosition] = child
          return {
            modified: makeUpdate(this, [
              setDelta(indexOfItemWithSamePosition, child)
            ]),
            reverse: []
          }
        } else {
          this._implicitlyDeletedItems.add(itemWithSamePosition)
          this._items[indexOfItemWithSamePosition] = child
          const delta = [setDelta(indexOfItemWithSamePosition, child)]
          const deleteDelta2 = this._detachItemAssociatedToSetOperation(
            op.deletedId
          )
          if (deleteDelta2) {
            delta.push(deleteDelta2)
          }
          return {
            modified: makeUpdate(this, delta),
            reverse: []
          }
        }
      } else {
        const updates = []
        const deleteDelta2 = this._detachItemAssociatedToSetOperation(
          op.deletedId
        )
        if (deleteDelta2) {
          updates.push(deleteDelta2)
        }
        this._insertAndSort(child)
        updates.push(insertDelta(this._indexOfPosition(key), child))
        return {
          reverse: [],
          modified: makeUpdate(this, updates)
        }
      }
    }
    /** @internal */
    _applySetAck(op) {
      if (this._pool === void 0) {
        throw new Error("Can't attach child if managed pool is not present")
      }
      const delta = []
      const deletedDelta = this._detachItemAssociatedToSetOperation(
        op.deletedId
      )
      if (deletedDelta) {
        delta.push(deletedDelta)
      }
      const unacknowledgedOpId = this._unacknowledgedSets.get(op.parentKey)
      if (unacknowledgedOpId !== void 0) {
        if (unacknowledgedOpId !== op.opId) {
          return delta.length === 0
            ? { modified: false }
            : { modified: makeUpdate(this, delta), reverse: [] }
        } else {
          this._unacknowledgedSets.delete(op.parentKey)
        }
      }
      const indexOfItemWithSamePosition = this._indexOfPosition(op.parentKey)
      const existingItem = this._items.find(item => item._id === op.id)
      if (existingItem !== void 0) {
        if (existingItem._parentKey === op.parentKey) {
          return {
            modified: delta.length > 0 ? makeUpdate(this, delta) : false,
            reverse: []
          }
        }
        if (indexOfItemWithSamePosition !== -1) {
          this._implicitlyDeletedItems.add(
            this._items[indexOfItemWithSamePosition]
          )
          this._items.splice(indexOfItemWithSamePosition, 1)
          delta.push(deleteDelta(indexOfItemWithSamePosition))
        }
        const previousIndex = this._items.indexOf(existingItem)
        existingItem._setParentLink(this, op.parentKey)
        this._sortItems()
        const newIndex = this._items.indexOf(existingItem)
        if (newIndex !== previousIndex) {
          delta.push(moveDelta(previousIndex, newIndex, existingItem))
        }
        return {
          modified: delta.length > 0 ? makeUpdate(this, delta) : false,
          reverse: []
        }
      } else {
        const orphan = this._pool.getNode(op.id)
        if (orphan && this._implicitlyDeletedItems.has(orphan)) {
          orphan._setParentLink(this, op.parentKey)
          this._implicitlyDeletedItems.delete(orphan)
          this._insertAndSort(orphan)
          const recreatedItemIndex = this._items.indexOf(orphan)
          return {
            modified: makeUpdate(this, [
              // If there is an item at this position, update is a set, else it's an insert
              indexOfItemWithSamePosition === -1
                ? insertDelta(recreatedItemIndex, orphan)
                : setDelta(recreatedItemIndex, orphan),
              ...delta
            ]),
            reverse: []
          }
        } else {
          if (indexOfItemWithSamePosition !== -1) {
            this._items.splice(indexOfItemWithSamePosition, 1)
          }
          const { newItem, newIndex } = this._createAttachItemAndSort(
            op,
            op.parentKey
          )
          return {
            modified: makeUpdate(this, [
              // If there is an item at this position, update is a set, else it's an insert
              indexOfItemWithSamePosition === -1
                ? insertDelta(newIndex, newItem)
                : setDelta(newIndex, newItem),
              ...delta
            ]),
            reverse: []
          }
        }
      }
    }
    /**
     * Returns the update delta of the deletion or null
     * @internal
     */
    _detachItemAssociatedToSetOperation(deletedId) {
      if (deletedId === void 0 || this._pool === void 0) {
        return null
      }
      const deletedItem = this._pool.getNode(deletedId)
      if (deletedItem === void 0) {
        return null
      }
      const result = this._detachChild(deletedItem)
      if (result.modified === false) {
        return null
      }
      return result.modified.updates[0]
    }
    /** @internal */
    _applyRemoteInsert(op) {
      if (this._pool === void 0) {
        throw new Error("Can't attach child if managed pool is not present")
      }
      const key = asPos(op.parentKey)
      const existingItemIndex = this._indexOfPosition(key)
      if (existingItemIndex !== -1) {
        this._shiftItemPosition(existingItemIndex, key)
      }
      const { newItem, newIndex } = this._createAttachItemAndSort(op, key)
      return {
        modified: makeUpdate(this, [insertDelta(newIndex, newItem)]),
        reverse: []
      }
    }
    /** @internal */
    _applyInsertAck(op) {
      const existingItem = this._items.find(item => item._id === op.id)
      const key = asPos(op.parentKey)
      const itemIndexAtPosition = this._indexOfPosition(key)
      if (existingItem) {
        if (existingItem._parentKey === key) {
          return {
            modified: false
          }
        } else {
          const oldPositionIndex = this._items.indexOf(existingItem)
          if (itemIndexAtPosition !== -1) {
            this._shiftItemPosition(itemIndexAtPosition, key)
          }
          existingItem._setParentLink(this, key)
          this._sortItems()
          const newIndex = this._indexOfPosition(key)
          if (newIndex === oldPositionIndex) {
            return { modified: false }
          }
          return {
            modified: makeUpdate(this, [
              moveDelta(oldPositionIndex, newIndex, existingItem)
            ]),
            reverse: []
          }
        }
      } else {
        const orphan = nn(this._pool).getNode(op.id)
        if (orphan && this._implicitlyDeletedItems.has(orphan)) {
          orphan._setParentLink(this, key)
          this._implicitlyDeletedItems.delete(orphan)
          this._insertAndSort(orphan)
          const newIndex = this._indexOfPosition(key)
          return {
            modified: makeUpdate(this, [insertDelta(newIndex, orphan)]),
            reverse: []
          }
        } else {
          if (itemIndexAtPosition !== -1) {
            this._shiftItemPosition(itemIndexAtPosition, key)
          }
          const { newItem, newIndex } = this._createAttachItemAndSort(op, key)
          return {
            modified: makeUpdate(this, [insertDelta(newIndex, newItem)]),
            reverse: []
          }
        }
      }
    }
    /** @internal */
    _applyInsertUndoRedo(op) {
      const { id, parentKey: key } = op
      const child = creationOpToLiveNode(op)
      if (this._pool?.getNode(id) !== void 0) {
        return { modified: false }
      }
      child._attach(id, nn(this._pool))
      child._setParentLink(this, key)
      const existingItemIndex = this._indexOfPosition(key)
      let newKey = key
      if (existingItemIndex !== -1) {
        const before2 = this._items[existingItemIndex]?._parentPos
        const after2 = this._items[existingItemIndex + 1]?._parentPos
        newKey = makePosition(before2, after2)
        child._setParentLink(this, newKey)
      }
      this._insertAndSort(child)
      const newIndex = this._indexOfPosition(newKey)
      return {
        modified: makeUpdate(this, [insertDelta(newIndex, child)]),
        reverse: [{ type: 5, id }]
      }
    }
    /** @internal */
    _applySetUndoRedo(op) {
      const { id, parentKey: key } = op
      const child = creationOpToLiveNode(op)
      if (this._pool?.getNode(id) !== void 0) {
        return { modified: false }
      }
      this._unacknowledgedSets.set(key, nn(op.opId))
      const indexOfItemWithSameKey = this._indexOfPosition(key)
      child._attach(id, nn(this._pool))
      child._setParentLink(this, key)
      const newKey = key
      if (indexOfItemWithSameKey !== -1) {
        const existingItem = this._items[indexOfItemWithSameKey]
        existingItem._detach()
        this._items[indexOfItemWithSameKey] = child
        const reverse = HACK_addIntentAndDeletedIdToOperation(
          existingItem._toOps(nn(this._id), key, this._pool),
          op.id
        )
        const delta = [setDelta(indexOfItemWithSameKey, child)]
        const deletedDelta = this._detachItemAssociatedToSetOperation(
          op.deletedId
        )
        if (deletedDelta) {
          delta.push(deletedDelta)
        }
        return {
          modified: makeUpdate(this, delta),
          reverse
        }
      } else {
        this._insertAndSort(child)
        this._detachItemAssociatedToSetOperation(op.deletedId)
        const newIndex = this._indexOfPosition(newKey)
        return {
          reverse: [{ type: 5, id }],
          modified: makeUpdate(this, [insertDelta(newIndex, child)])
        }
      }
    }
    /** @internal */
    _attachChild(op, source) {
      if (this._pool === void 0) {
        throw new Error("Can't attach child if managed pool is not present")
      }
      let result
      if (op.intent === 'set') {
        if (source === 1) {
          result = this._applySetRemote(op)
        } else if (source === 2) {
          result = this._applySetAck(op)
        } else {
          result = this._applySetUndoRedo(op)
        }
      } else {
        if (source === 1) {
          result = this._applyRemoteInsert(op)
        } else if (source === 2) {
          result = this._applyInsertAck(op)
        } else {
          result = this._applyInsertUndoRedo(op)
        }
      }
      if (result.modified !== false) {
        this.invalidate()
      }
      return result
    }
    /** @internal */
    _detachChild(child) {
      if (child) {
        const parentKey = nn(child._parentKey)
        const reverse = child._toOps(nn(this._id), parentKey, this._pool)
        const indexToDelete = this._items.indexOf(child)
        if (indexToDelete === -1) {
          return {
            modified: false
          }
        }
        this._items.splice(indexToDelete, 1)
        this.invalidate()
        child._detach()
        return {
          modified: makeUpdate(this, [deleteDelta(indexToDelete)]),
          reverse
        }
      }
      return { modified: false }
    }
    /** @internal */
    _applySetChildKeyRemote(newKey, child) {
      if (this._implicitlyDeletedItems.has(child)) {
        this._implicitlyDeletedItems.delete(child)
        child._setParentLink(this, newKey)
        this._insertAndSort(child)
        const newIndex = this._items.indexOf(child)
        return {
          modified: makeUpdate(this, [insertDelta(newIndex, child)]),
          reverse: []
        }
      }
      const previousKey = child._parentKey
      if (newKey === previousKey) {
        return {
          modified: false
        }
      }
      const existingItemIndex = this._indexOfPosition(newKey)
      if (existingItemIndex === -1) {
        const previousIndex = this._items.indexOf(child)
        child._setParentLink(this, newKey)
        this._sortItems()
        const newIndex = this._items.indexOf(child)
        if (newIndex === previousIndex) {
          return {
            modified: false
          }
        }
        return {
          modified: makeUpdate(this, [
            moveDelta(previousIndex, newIndex, child)
          ]),
          reverse: []
        }
      } else {
        this._items[existingItemIndex]._setParentLink(
          this,
          makePosition(newKey, this._items[existingItemIndex + 1]?._parentPos)
        )
        const previousIndex = this._items.indexOf(child)
        child._setParentLink(this, newKey)
        this._sortItems()
        const newIndex = this._items.indexOf(child)
        if (newIndex === previousIndex) {
          return {
            modified: false
          }
        }
        return {
          modified: makeUpdate(this, [
            moveDelta(previousIndex, newIndex, child)
          ]),
          reverse: []
        }
      }
    }
    /** @internal */
    _applySetChildKeyAck(newKey, child) {
      const previousKey = nn(child._parentKey)
      if (this._implicitlyDeletedItems.has(child)) {
        const existingItemIndex = this._indexOfPosition(newKey)
        this._implicitlyDeletedItems.delete(child)
        if (existingItemIndex !== -1) {
          this._items[existingItemIndex]._setParentLink(
            this,
            makePosition(newKey, this._items[existingItemIndex + 1]?._parentPos)
          )
        }
        child._setParentLink(this, newKey)
        this._insertAndSort(child)
        return {
          modified: false
        }
      } else {
        if (newKey === previousKey) {
          return {
            modified: false
          }
        }
        const previousIndex = this._items.indexOf(child)
        const existingItemIndex = this._indexOfPosition(newKey)
        if (existingItemIndex !== -1) {
          this._items[existingItemIndex]._setParentLink(
            this,
            makePosition(newKey, this._items[existingItemIndex + 1]?._parentPos)
          )
        }
        child._setParentLink(this, newKey)
        this._sortItems()
        const newIndex = this._items.indexOf(child)
        if (previousIndex === newIndex) {
          return {
            modified: false
          }
        } else {
          return {
            modified: makeUpdate(this, [
              moveDelta(previousIndex, newIndex, child)
            ]),
            reverse: []
          }
        }
      }
    }
    /** @internal */
    _applySetChildKeyUndoRedo(newKey, child) {
      const previousKey = nn(child._parentKey)
      const previousIndex = this._items.indexOf(child)
      const existingItemIndex = this._indexOfPosition(newKey)
      if (existingItemIndex !== -1) {
        this._items[existingItemIndex]._setParentLink(
          this,
          makePosition(newKey, this._items[existingItemIndex + 1]?._parentPos)
        )
      }
      child._setParentLink(this, newKey)
      this._sortItems()
      const newIndex = this._items.indexOf(child)
      if (previousIndex === newIndex) {
        return {
          modified: false
        }
      }
      return {
        modified: makeUpdate(this, [moveDelta(previousIndex, newIndex, child)]),
        reverse: [
          {
            type: 1,
            id: nn(child._id),
            parentKey: previousKey
          }
        ]
      }
    }
    /** @internal */
    _setChildKey(newKey, child, source) {
      if (source === 1) {
        return this._applySetChildKeyRemote(newKey, child)
      } else if (source === 2) {
        return this._applySetChildKeyAck(newKey, child)
      } else {
        return this._applySetChildKeyUndoRedo(newKey, child)
      }
    }
    /** @internal */
    _apply(op, isLocal) {
      return super._apply(op, isLocal)
    }
    /** @internal */
    _serialize() {
      if (this.parent.type !== 'HasParent') {
        throw new Error('Cannot serialize LiveList if parent is missing')
      }
      return {
        type: 1,
        parentId: nn(this.parent.node._id, 'Parent node expected to have ID'),
        parentKey: this.parent.key
      }
    }
    /**
     * Returns the number of elements.
     */
    get length() {
      return this._items.length
    }
    /**
     * Adds one element to the end of the LiveList.
     * @param element The element to add to the end of the LiveList.
     */
    push(element) {
      this._pool?.assertStorageIsWritable()
      return this.insert(element, this.length)
    }
    /**
     * Inserts one element at a specified index.
     * @param element The element to insert.
     * @param index The index at which you want to insert the element.
     */
    insert(element, index) {
      this._pool?.assertStorageIsWritable()
      if (index < 0 || index > this._items.length) {
        throw new Error(
          `Cannot insert list item at index "${index}". index should be between 0 and ${this._items.length}`
        )
      }
      const before2 = this._items[index - 1]
        ? this._items[index - 1]._parentPos
        : void 0
      const after2 = this._items[index] ? this._items[index]._parentPos : void 0
      const position = makePosition(before2, after2)
      const value = lsonToLiveNode(element)
      value._setParentLink(this, position)
      this._insertAndSort(value)
      if (this._pool && this._id) {
        const id = this._pool.generateId()
        value._attach(id, this._pool)
        this._pool.dispatch(
          value._toOps(this._id, position, this._pool),
          [{ type: 5, id }],
          /* @__PURE__ */ new Map([
            [this._id, makeUpdate(this, [insertDelta(index, value)])]
          ])
        )
      }
    }
    /**
     * Move one element from one index to another.
     * @param index The index of the element to move
     * @param targetIndex The index where the element should be after moving.
     */
    move(index, targetIndex) {
      this._pool?.assertStorageIsWritable()
      if (targetIndex < 0) {
        throw new Error('targetIndex cannot be less than 0')
      }
      if (targetIndex >= this._items.length) {
        throw new Error(
          'targetIndex cannot be greater or equal than the list length'
        )
      }
      if (index < 0) {
        throw new Error('index cannot be less than 0')
      }
      if (index >= this._items.length) {
        throw new Error('index cannot be greater or equal than the list length')
      }
      let beforePosition = null
      let afterPosition = null
      if (index < targetIndex) {
        afterPosition =
          targetIndex === this._items.length - 1
            ? void 0
            : this._items[targetIndex + 1]._parentPos
        beforePosition = this._items[targetIndex]._parentPos
      } else {
        afterPosition = this._items[targetIndex]._parentPos
        beforePosition =
          targetIndex === 0 ? void 0 : this._items[targetIndex - 1]._parentPos
      }
      const position = makePosition(beforePosition, afterPosition)
      const item = this._items[index]
      const previousPosition = item._getParentKeyOrThrow()
      item._setParentLink(this, position)
      this._sortItems()
      if (this._pool && this._id) {
        const storageUpdates = /* @__PURE__ */ new Map([
          [this._id, makeUpdate(this, [moveDelta(index, targetIndex, item)])]
        ])
        this._pool.dispatch(
          [
            {
              type: 1,
              id: nn(item._id),
              opId: this._pool.generateOpId(),
              parentKey: position
            }
          ],
          [
            {
              type: 1,
              id: nn(item._id),
              parentKey: previousPosition
            }
          ],
          storageUpdates
        )
      }
    }
    /**
     * Deletes an element at the specified index
     * @param index The index of the element to delete
     */
    delete(index) {
      this._pool?.assertStorageIsWritable()
      if (index < 0 || index >= this._items.length) {
        throw new Error(
          `Cannot delete list item at index "${index}". index should be between 0 and ${
            this._items.length - 1
          }`
        )
      }
      const item = this._items[index]
      item._detach()
      this._items.splice(index, 1)
      this.invalidate()
      if (this._pool) {
        const childRecordId = item._id
        if (childRecordId) {
          const storageUpdates = /* @__PURE__ */ new Map()
          storageUpdates.set(
            nn(this._id),
            makeUpdate(this, [deleteDelta(index)])
          )
          this._pool.dispatch(
            [
              {
                id: childRecordId,
                opId: this._pool.generateOpId(),
                type: 5
                /* DELETE_CRDT */
              }
            ],
            item._toOps(nn(this._id), item._getParentKeyOrThrow()),
            storageUpdates
          )
        }
      }
    }
    clear() {
      this._pool?.assertStorageIsWritable()
      if (this._pool) {
        const ops = []
        const reverseOps = []
        const updateDelta = []
        for (const item of this._items) {
          item._detach()
          const childId = item._id
          if (childId) {
            ops.push({
              type: 5,
              id: childId,
              opId: this._pool.generateOpId()
            })
            reverseOps.push(
              ...item._toOps(nn(this._id), item._getParentKeyOrThrow())
            )
            updateDelta.push(deleteDelta(0))
          }
        }
        this._items = []
        this.invalidate()
        const storageUpdates = /* @__PURE__ */ new Map()
        storageUpdates.set(nn(this._id), makeUpdate(this, updateDelta))
        this._pool.dispatch(ops, reverseOps, storageUpdates)
      } else {
        for (const item of this._items) {
          item._detach()
        }
        this._items = []
        this.invalidate()
      }
    }
    set(index, item) {
      this._pool?.assertStorageIsWritable()
      if (index < 0 || index >= this._items.length) {
        throw new Error(
          `Cannot set list item at index "${index}". index should be between 0 and ${
            this._items.length - 1
          }`
        )
      }
      const existingItem = this._items[index]
      const position = existingItem._getParentKeyOrThrow()
      const existingId = existingItem._id
      existingItem._detach()
      const value = lsonToLiveNode(item)
      value._setParentLink(this, position)
      this._items[index] = value
      this.invalidate()
      if (this._pool && this._id) {
        const id = this._pool.generateId()
        value._attach(id, this._pool)
        const storageUpdates = /* @__PURE__ */ new Map()
        storageUpdates.set(this._id, makeUpdate(this, [setDelta(index, value)]))
        const ops = HACK_addIntentAndDeletedIdToOperation(
          value._toOps(this._id, position, this._pool),
          existingId
        )
        this._unacknowledgedSets.set(position, nn(ops[0].opId))
        const reverseOps = HACK_addIntentAndDeletedIdToOperation(
          existingItem._toOps(this._id, position, void 0),
          id
        )
        this._pool.dispatch(ops, reverseOps, storageUpdates)
      }
    }
    /**
     * Returns an Array of all the elements in the LiveList.
     */
    toArray() {
      return this._items.map(
        entry => liveNodeToLson(entry)
        //                               ^^^^^^^^
        //                               FIXME! This isn't safe.
      )
    }
    /**
     * Tests whether all elements pass the test implemented by the provided function.
     * @param predicate Function to test for each element, taking two arguments (the element and its index).
     * @returns true if the predicate function returns a truthy value for every element. Otherwise, false.
     */
    every(predicate) {
      return this.toArray().every(predicate)
    }
    /**
     * Creates an array with all elements that pass the test implemented by the provided function.
     * @param predicate Function to test each element of the LiveList. Return a value that coerces to true to keep the element, or to false otherwise.
     * @returns An array with the elements that pass the test.
     */
    filter(predicate) {
      return this.toArray().filter(predicate)
    }
    /**
     * Returns the first element that satisfies the provided testing function.
     * @param predicate Function to execute on each value.
     * @returns The value of the first element in the LiveList that satisfies the provided testing function. Otherwise, undefined is returned.
     */
    find(predicate) {
      return this.toArray().find(predicate)
    }
    /**
     * Returns the index of the first element in the LiveList that satisfies the provided testing function.
     * @param predicate Function to execute on each value until the function returns true, indicating that the satisfying element was found.
     * @returns The index of the first element in the LiveList that passes the test. Otherwise, -1.
     */
    findIndex(predicate) {
      return this.toArray().findIndex(predicate)
    }
    /**
     * Executes a provided function once for each element.
     * @param callbackfn Function to execute on each element.
     */
    forEach(callbackfn) {
      return this.toArray().forEach(callbackfn)
    }
    /**
     * Get the element at the specified index.
     * @param index The index on the element to get.
     * @returns The element at the specified index or undefined.
     */
    get(index) {
      if (index < 0 || index >= this._items.length) {
        return void 0
      }
      return liveNodeToLson(this._items[index])
    }
    /**
     * Returns the first index at which a given element can be found in the LiveList, or -1 if it is not present.
     * @param searchElement Element to locate.
     * @param fromIndex The index to start the search at.
     * @returns The first index of the element in the LiveList; -1 if not found.
     */
    indexOf(searchElement, fromIndex) {
      return this.toArray().indexOf(searchElement, fromIndex)
    }
    /**
     * Returns the last index at which a given element can be found in the LiveList, or -1 if it is not present. The LiveLsit is searched backwards, starting at fromIndex.
     * @param searchElement Element to locate.
     * @param fromIndex The index at which to start searching backwards.
     * @returns
     */
    lastIndexOf(searchElement, fromIndex) {
      return this.toArray().lastIndexOf(searchElement, fromIndex)
    }
    /**
     * Creates an array populated with the results of calling a provided function on every element.
     * @param callback Function that is called for every element.
     * @returns An array with each element being the result of the callback function.
     */
    map(callback) {
      return this._items.map((entry, i) =>
        callback(
          liveNodeToLson(entry),
          //                    ^^^^^^^^
          //                    FIXME! This isn't safe.
          i
        )
      )
    }
    /**
     * Tests whether at least one element in the LiveList passes the test implemented by the provided function.
     * @param predicate Function to test for each element.
     * @returns true if the callback function returns a truthy value for at least one element. Otherwise, false.
     */
    some(predicate) {
      return this.toArray().some(predicate)
    }
    [Symbol.iterator]() {
      return new LiveListIterator(this._items)
    }
    /** @internal */
    _createAttachItemAndSort(op, key) {
      const newItem = creationOpToLiveNode(op)
      newItem._attach(op.id, nn(this._pool))
      newItem._setParentLink(this, key)
      this._insertAndSort(newItem)
      const newIndex = this._indexOfPosition(key)
      return { newItem, newIndex }
    }
    /** @internal */
    _shiftItemPosition(index, key) {
      const shiftedPosition = makePosition(
        key,
        this._items.length > index + 1
          ? this._items[index + 1]?._parentPos
          : void 0
      )
      this._items[index]._setParentLink(this, shiftedPosition)
    }
    /** @internal */
    _toTreeNode(key) {
      return {
        type: 'LiveList',
        id: this._id ?? nanoid(),
        key,
        payload: this._items.map((item, index) =>
          item.toTreeNode(index.toString())
        )
      }
    }
    toImmutable() {
      return super.toImmutable()
    }
    /** @internal */
    _toImmutable() {
      const result = this._items.map(node => node.toImmutable())
      return false ? result : Object.freeze(result)
    }
  }
  var LiveListIterator = class {
    constructor(items) {
      this._innerIterator = items[Symbol.iterator]()
    }
    [Symbol.iterator]() {
      return this
    }
    next() {
      const result = this._innerIterator.next()
      if (result.done) {
        return {
          done: true,
          value: void 0
        }
      }
      const value = liveNodeToLson(result.value)
      return { value }
    }
  }
  function makeUpdate(liveList, deltaUpdates) {
    return {
      node: liveList,
      type: 'LiveList',
      updates: deltaUpdates
    }
  }
  function setDelta(index, item) {
    return {
      index,
      type: 'set',
      item: item instanceof LiveRegister ? item.data : item
    }
  }
  function deleteDelta(index) {
    return {
      index,
      type: 'delete'
    }
  }
  function insertDelta(index, item) {
    return {
      index,
      type: 'insert',
      item: item instanceof LiveRegister ? item.data : item
    }
  }
  function moveDelta(previousIndex, index, item) {
    return {
      index,
      type: 'move',
      previousIndex,
      item: item instanceof LiveRegister ? item.data : item
    }
  }
  function HACK_addIntentAndDeletedIdToOperation(ops, deletedId) {
    return ops.map((op, index) => {
      if (index === 0) {
        const firstOp = op
        return {
          ...firstOp,
          intent: 'set',
          deletedId
        }
      } else {
        return op
      }
    })
  }
  var freeze = false
    ? /* istanbul ignore next */
      x => x
    : Object.freeze
  var LiveMap = class _LiveMap extends AbstractCrdt {
    constructor(entries2) {
      super()
      this.unacknowledgedSet = /* @__PURE__ */ new Map()
      if (entries2) {
        const mappedEntries = []
        for (const entry of entries2) {
          const value = lsonToLiveNode(entry[1])
          value._setParentLink(this, entry[0])
          mappedEntries.push([entry[0], value])
        }
        this._map = new Map(mappedEntries)
      } else {
        this._map = /* @__PURE__ */ new Map()
      }
    }
    /**
     * @internal
     */
    _toOps(parentId, parentKey, pool) {
      if (this._id === void 0) {
        throw new Error('Cannot serialize item is not attached')
      }
      const ops = []
      const op = {
        id: this._id,
        opId: pool?.generateOpId(),
        type: 7,
        parentId,
        parentKey
      }
      ops.push(op)
      for (const [key, value] of this._map) {
        ops.push(...value._toOps(this._id, key, pool))
      }
      return ops
    }
    /**
     * @internal
     */
    static _deserialize([id, _item], parentToChildren, pool) {
      const map = new _LiveMap()
      map._attach(id, pool)
      const children = parentToChildren.get(id)
      if (children === void 0) {
        return map
      }
      for (const [id2, crdt] of children) {
        const child = deserialize([id2, crdt], parentToChildren, pool)
        child._setParentLink(map, crdt.parentKey)
        map._map.set(crdt.parentKey, child)
        map.invalidate()
      }
      return map
    }
    /**
     * @internal
     */
    _attach(id, pool) {
      super._attach(id, pool)
      for (const [_key, value] of this._map) {
        if (isLiveNode(value)) {
          value._attach(pool.generateId(), pool)
        }
      }
    }
    /**
     * @internal
     */
    _attachChild(op, source) {
      if (this._pool === void 0) {
        throw new Error("Can't attach child if managed pool is not present")
      }
      const { id, parentKey, opId } = op
      const key = parentKey
      const child = creationOpToLiveNode(op)
      if (this._pool.getNode(id) !== void 0) {
        return { modified: false }
      }
      if (source === 2) {
        const lastUpdateOpId = this.unacknowledgedSet.get(key)
        if (lastUpdateOpId === opId) {
          this.unacknowledgedSet.delete(key)
          return { modified: false }
        } else if (lastUpdateOpId !== void 0) {
          return { modified: false }
        }
      } else if (source === 1) {
        this.unacknowledgedSet.delete(key)
      }
      const previousValue = this._map.get(key)
      let reverse
      if (previousValue) {
        const thisId = nn(this._id)
        reverse = previousValue._toOps(thisId, key)
        previousValue._detach()
      } else {
        reverse = [{ type: 5, id }]
      }
      child._setParentLink(this, key)
      child._attach(id, this._pool)
      this._map.set(key, child)
      this.invalidate()
      return {
        modified: {
          node: this,
          type: 'LiveMap',
          updates: { [key]: { type: 'update' } }
        },
        reverse
      }
    }
    /**
     * @internal
     */
    _detach() {
      super._detach()
      for (const item of this._map.values()) {
        item._detach()
      }
    }
    /**
     * @internal
     */
    _detachChild(child) {
      const id = nn(this._id)
      const parentKey = nn(child._parentKey)
      const reverse = child._toOps(id, parentKey, this._pool)
      for (const [key, value] of this._map) {
        if (value === child) {
          this._map.delete(key)
          this.invalidate()
        }
      }
      child._detach()
      const storageUpdate = {
        node: this,
        type: 'LiveMap',
        updates: { [parentKey]: { type: 'delete' } }
      }
      return { modified: storageUpdate, reverse }
    }
    /**
     * @internal
     */
    _serialize() {
      if (this.parent.type !== 'HasParent') {
        throw new Error('Cannot serialize LiveMap if parent is missing')
      }
      return {
        type: 2,
        parentId: nn(this.parent.node._id, 'Parent node expected to have ID'),
        parentKey: this.parent.key
      }
    }
    /**
     * Returns a specified element from the LiveMap.
     * @param key The key of the element to return.
     * @returns The element associated with the specified key, or undefined if the key can't be found in the LiveMap.
     */
    get(key) {
      const value = this._map.get(key)
      if (value === void 0) {
        return void 0
      }
      return liveNodeToLson(value)
    }
    /**
     * Adds or updates an element with a specified key and a value.
     * @param key The key of the element to add. Should be a string.
     * @param value The value of the element to add. Should be serializable to JSON.
     */
    set(key, value) {
      this._pool?.assertStorageIsWritable()
      const oldValue = this._map.get(key)
      if (oldValue) {
        oldValue._detach()
      }
      const item = lsonToLiveNode(value)
      item._setParentLink(this, key)
      this._map.set(key, item)
      this.invalidate()
      if (this._pool && this._id) {
        const id = this._pool.generateId()
        item._attach(id, this._pool)
        const storageUpdates = /* @__PURE__ */ new Map()
        storageUpdates.set(this._id, {
          node: this,
          type: 'LiveMap',
          updates: { [key]: { type: 'update' } }
        })
        const ops = item._toOps(this._id, key, this._pool)
        this.unacknowledgedSet.set(key, nn(ops[0].opId))
        this._pool.dispatch(
          item._toOps(this._id, key, this._pool),
          oldValue ? oldValue._toOps(this._id, key) : [{ type: 5, id }],
          storageUpdates
        )
      }
    }
    /**
     * Returns the number of elements in the LiveMap.
     */
    get size() {
      return this._map.size
    }
    /**
     * Returns a boolean indicating whether an element with the specified key exists or not.
     * @param key The key of the element to test for presence.
     */
    has(key) {
      return this._map.has(key)
    }
    /**
     * Removes the specified element by key.
     * @param key The key of the element to remove.
     * @returns true if an element existed and has been removed, or false if the element does not exist.
     */
    delete(key) {
      this._pool?.assertStorageIsWritable()
      const item = this._map.get(key)
      if (item === void 0) {
        return false
      }
      item._detach()
      this._map.delete(key)
      this.invalidate()
      if (this._pool && item._id) {
        const thisId = nn(this._id)
        const storageUpdates = /* @__PURE__ */ new Map()
        storageUpdates.set(thisId, {
          node: this,
          type: 'LiveMap',
          updates: { [key]: { type: 'delete' } }
        })
        this._pool.dispatch(
          [
            {
              type: 5,
              id: item._id,
              opId: this._pool.generateOpId()
            }
          ],
          item._toOps(thisId, key),
          storageUpdates
        )
      }
      return true
    }
    /**
     * Returns a new Iterator object that contains the [key, value] pairs for each element.
     */
    entries() {
      const innerIterator = this._map.entries()
      return {
        [Symbol.iterator]() {
          return this
        },
        next() {
          const iteratorValue = innerIterator.next()
          if (iteratorValue.done) {
            return {
              done: true,
              value: void 0
            }
          }
          const entry = iteratorValue.value
          const key = entry[0]
          const value = liveNodeToLson(iteratorValue.value[1])
          return {
            value: [key, value]
          }
        }
      }
    }
    /**
     * Same function object as the initial value of the entries method.
     */
    [Symbol.iterator]() {
      return this.entries()
    }
    /**
     * Returns a new Iterator object that contains the keys for each element.
     */
    keys() {
      return this._map.keys()
    }
    /**
     * Returns a new Iterator object that contains the values for each element.
     */
    values() {
      const innerIterator = this._map.values()
      return {
        [Symbol.iterator]() {
          return this
        },
        next() {
          const iteratorValue = innerIterator.next()
          if (iteratorValue.done) {
            return {
              done: true,
              value: void 0
            }
          }
          const value = liveNodeToLson(iteratorValue.value)
          return { value }
        }
      }
    }
    /**
     * Executes a provided function once per each key/value pair in the Map object, in insertion order.
     * @param callback Function to execute for each entry in the map.
     */
    forEach(callback) {
      for (const entry of this) {
        callback(entry[1], entry[0], this)
      }
    }
    /** @internal */
    _toTreeNode(key) {
      return {
        type: 'LiveMap',
        id: this._id ?? nanoid(),
        key,
        payload: Array.from(this._map.entries()).map(([key2, val]) =>
          val.toTreeNode(key2)
        )
      }
    }
    toImmutable() {
      return super.toImmutable()
    }
    /** @internal */
    _toImmutable() {
      const result = /* @__PURE__ */ new Map()
      for (const [key, value] of this._map) {
        result.set(key, value.toImmutable())
      }
      return freeze(result)
    }
  }
  var LiveObject = class _LiveObject extends AbstractCrdt {
    constructor(obj = {}) {
      super()
      this._propToLastUpdate = /* @__PURE__ */ new Map()
      for (const key in obj) {
        const value = obj[key]
        if (value === void 0) {
          continue
        } else if (isLiveNode(value)) {
          value._setParentLink(this, key)
        }
      }
      this._map = new Map(Object.entries(obj))
    }
    /** @internal */
    static _buildRootAndParentToChildren(items) {
      const parentToChildren = /* @__PURE__ */ new Map()
      let root = null
      for (const [id, crdt] of items) {
        if (isRootCrdt(crdt)) {
          root = [id, crdt]
        } else {
          const tuple = [id, crdt]
          const children = parentToChildren.get(crdt.parentId)
          if (children !== void 0) {
            children.push(tuple)
          } else {
            parentToChildren.set(crdt.parentId, [tuple])
          }
        }
      }
      if (root === null) {
        throw new Error("Root can't be null")
      }
      return [root, parentToChildren]
    }
    /** @internal */
    static _fromItems(items, pool) {
      const [root, parentToChildren] =
        _LiveObject._buildRootAndParentToChildren(items)
      return _LiveObject._deserialize(root, parentToChildren, pool)
    }
    /** @internal */
    _toOps(parentId, parentKey, pool) {
      if (this._id === void 0) {
        throw new Error('Cannot serialize item is not attached')
      }
      const opId = pool?.generateOpId()
      const ops = []
      const op =
        parentId !== void 0 && parentKey !== void 0
          ? {
              type: 4,
              id: this._id,
              opId,
              parentId,
              parentKey,
              data: {}
            }
          : // Root object
            { type: 4, id: this._id, opId, data: {} }
      ops.push(op)
      for (const [key, value] of this._map) {
        if (isLiveNode(value)) {
          ops.push(...value._toOps(this._id, key, pool))
        } else {
          op.data[key] = value
        }
      }
      return ops
    }
    /** @internal */
    static _deserialize([id, item], parentToChildren, pool) {
      const liveObj = new _LiveObject(item.data)
      liveObj._attach(id, pool)
      return this._deserializeChildren(liveObj, parentToChildren, pool)
    }
    /** @internal */
    static _deserializeChildren(liveObj, parentToChildren, pool) {
      const children = parentToChildren.get(nn(liveObj._id))
      if (children === void 0) {
        return liveObj
      }
      for (const [id, crdt] of children) {
        const child = deserializeToLson([id, crdt], parentToChildren, pool)
        if (isLiveStructure(child)) {
          child._setParentLink(liveObj, crdt.parentKey)
        }
        liveObj._map.set(crdt.parentKey, child)
        liveObj.invalidate()
      }
      return liveObj
    }
    /** @internal */
    _attach(id, pool) {
      super._attach(id, pool)
      for (const [_key, value] of this._map) {
        if (isLiveNode(value)) {
          value._attach(pool.generateId(), pool)
        }
      }
    }
    /** @internal */
    _attachChild(op, source) {
      if (this._pool === void 0) {
        throw new Error("Can't attach child if managed pool is not present")
      }
      const { id, opId, parentKey: key } = op
      const child = creationOpToLson(op)
      if (this._pool.getNode(id) !== void 0) {
        if (this._propToLastUpdate.get(key) === opId) {
          this._propToLastUpdate.delete(key)
        }
        return { modified: false }
      }
      if (source === 0) {
        this._propToLastUpdate.set(key, nn(opId))
      } else if (this._propToLastUpdate.get(key) === void 0) {
      } else if (this._propToLastUpdate.get(key) === opId) {
        this._propToLastUpdate.delete(key)
        return { modified: false }
      } else {
        return { modified: false }
      }
      const thisId = nn(this._id)
      const previousValue = this._map.get(key)
      let reverse
      if (isLiveNode(previousValue)) {
        reverse = previousValue._toOps(thisId, key)
        previousValue._detach()
      } else if (previousValue === void 0) {
        reverse = [{ type: 6, id: thisId, key }]
      } else {
        reverse = [
          {
            type: 3,
            id: thisId,
            data: { [key]: previousValue }
          }
        ]
      }
      this._map.set(key, child)
      this.invalidate()
      if (isLiveStructure(child)) {
        child._setParentLink(this, key)
        child._attach(id, this._pool)
      }
      return {
        reverse,
        modified: {
          node: this,
          type: 'LiveObject',
          updates: { [key]: { type: 'update' } }
        }
      }
    }
    /** @internal */
    _detachChild(child) {
      if (child) {
        const id = nn(this._id)
        const parentKey = nn(child._parentKey)
        const reverse = child._toOps(id, parentKey, this._pool)
        for (const [key, value] of this._map) {
          if (value === child) {
            this._map.delete(key)
            this.invalidate()
          }
        }
        child._detach()
        const storageUpdate = {
          node: this,
          type: 'LiveObject',
          updates: {
            [parentKey]: { type: 'delete' }
          }
        }
        return { modified: storageUpdate, reverse }
      }
      return { modified: false }
    }
    /**
     * @internal
     */
    _detach() {
      super._detach()
      for (const value of this._map.values()) {
        if (isLiveNode(value)) {
          value._detach()
        }
      }
    }
    /** @internal */
    _apply(op, isLocal) {
      if (op.type === 3) {
        return this._applyUpdate(op, isLocal)
      } else if (op.type === 6) {
        return this._applyDeleteObjectKey(op, isLocal)
      }
      return super._apply(op, isLocal)
    }
    /**
     * @internal
     */
    _serialize() {
      const data = {}
      for (const [key, value] of this._map) {
        if (!isLiveNode(value)) {
          data[key] = value
        }
      }
      if (this.parent.type === 'HasParent' && this.parent.node._id) {
        return {
          type: 0,
          parentId: this.parent.node._id,
          parentKey: this.parent.key,
          data
        }
      } else {
        return {
          type: 0,
          data
        }
      }
    }
    /** @internal */
    _applyUpdate(op, isLocal) {
      let isModified = false
      const id = nn(this._id)
      const reverse = []
      const reverseUpdate = {
        type: 3,
        id,
        data: {}
      }
      for (const key in op.data) {
        const oldValue = this._map.get(key)
        if (isLiveNode(oldValue)) {
          reverse.push(...oldValue._toOps(id, key))
          oldValue._detach()
        } else if (oldValue !== void 0) {
          reverseUpdate.data[key] = oldValue
        } else if (oldValue === void 0) {
          reverse.push({ type: 6, id, key })
        }
      }
      const updateDelta = {}
      for (const key in op.data) {
        const value = op.data[key]
        if (value === void 0) {
          continue
        }
        if (isLocal) {
          this._propToLastUpdate.set(key, nn(op.opId))
        } else if (this._propToLastUpdate.get(key) === void 0) {
          isModified = true
        } else if (this._propToLastUpdate.get(key) === op.opId) {
          this._propToLastUpdate.delete(key)
          continue
        } else {
          continue
        }
        const oldValue = this._map.get(key)
        if (isLiveNode(oldValue)) {
          oldValue._detach()
        }
        isModified = true
        updateDelta[key] = { type: 'update' }
        this._map.set(key, value)
        this.invalidate()
      }
      if (Object.keys(reverseUpdate.data).length !== 0) {
        reverse.unshift(reverseUpdate)
      }
      return isModified
        ? {
            modified: {
              node: this,
              type: 'LiveObject',
              updates: updateDelta
            },
            reverse
          }
        : { modified: false }
    }
    /** @internal */
    _applyDeleteObjectKey(op, isLocal) {
      const key = op.key
      if (this._map.has(key) === false) {
        return { modified: false }
      }
      if (!isLocal && this._propToLastUpdate.get(key) !== void 0) {
        return { modified: false }
      }
      const oldValue = this._map.get(key)
      const id = nn(this._id)
      let reverse = []
      if (isLiveNode(oldValue)) {
        reverse = oldValue._toOps(id, op.key)
        oldValue._detach()
      } else if (oldValue !== void 0) {
        reverse = [
          {
            type: 3,
            id,
            data: { [key]: oldValue }
          }
        ]
      }
      this._map.delete(key)
      this.invalidate()
      return {
        modified: {
          node: this,
          type: 'LiveObject',
          updates: { [op.key]: { type: 'delete' } }
        },
        reverse
      }
    }
    /**
     * Transform the LiveObject into a javascript object
     */
    toObject() {
      return Object.fromEntries(this._map)
    }
    /**
     * Adds or updates a property with a specified key and a value.
     * @param key The key of the property to add
     * @param value The value of the property to add
     */
    set(key, value) {
      this._pool?.assertStorageIsWritable()
      this.update({ [key]: value })
    }
    /**
     * Returns a specified property from the LiveObject.
     * @param key The key of the property to get
     */
    get(key) {
      return this._map.get(key)
    }
    /**
     * Deletes a key from the LiveObject
     * @param key The key of the property to delete
     */
    delete(key) {
      this._pool?.assertStorageIsWritable()
      const keyAsString = key
      const oldValue = this._map.get(keyAsString)
      if (oldValue === void 0) {
        return
      }
      if (this._pool === void 0 || this._id === void 0) {
        if (isLiveNode(oldValue)) {
          oldValue._detach()
        }
        this._map.delete(keyAsString)
        this.invalidate()
        return
      }
      let reverse
      if (isLiveNode(oldValue)) {
        oldValue._detach()
        reverse = oldValue._toOps(this._id, keyAsString)
      } else {
        reverse = [
          {
            type: 3,
            data: { [keyAsString]: oldValue },
            id: this._id
          }
        ]
      }
      this._map.delete(keyAsString)
      this.invalidate()
      const storageUpdates = /* @__PURE__ */ new Map()
      storageUpdates.set(this._id, {
        node: this,
        type: 'LiveObject',
        updates: { [key]: { type: 'delete' } }
      })
      this._pool.dispatch(
        [
          {
            type: 6,
            key: keyAsString,
            id: this._id,
            opId: this._pool.generateOpId()
          }
        ],
        reverse,
        storageUpdates
      )
    }
    /**
     * Adds or updates multiple properties at once with an object.
     * @param patch The object used to overrides properties
     */
    update(patch) {
      this._pool?.assertStorageIsWritable()
      if (this._pool === void 0 || this._id === void 0) {
        for (const key in patch) {
          const newValue = patch[key]
          if (newValue === void 0) {
            continue
          }
          const oldValue = this._map.get(key)
          if (isLiveNode(oldValue)) {
            oldValue._detach()
          }
          if (isLiveNode(newValue)) {
            newValue._setParentLink(this, key)
          }
          this._map.set(key, newValue)
          this.invalidate()
        }
        return
      }
      const ops = []
      const reverseOps = []
      const opId = this._pool.generateOpId()
      const updatedProps = {}
      const reverseUpdateOp = {
        id: this._id,
        type: 3,
        data: {}
      }
      const updateDelta = {}
      for (const key in patch) {
        const newValue = patch[key]
        if (newValue === void 0) {
          continue
        }
        const oldValue = this._map.get(key)
        if (isLiveNode(oldValue)) {
          reverseOps.push(...oldValue._toOps(this._id, key))
          oldValue._detach()
        } else if (oldValue === void 0) {
          reverseOps.push({ type: 6, id: this._id, key })
        } else {
          reverseUpdateOp.data[key] = oldValue
        }
        if (isLiveNode(newValue)) {
          newValue._setParentLink(this, key)
          newValue._attach(this._pool.generateId(), this._pool)
          const newAttachChildOps = newValue._toOps(this._id, key, this._pool)
          const createCrdtOp = newAttachChildOps.find(
            op => op.parentId === this._id
          )
          if (createCrdtOp) {
            this._propToLastUpdate.set(key, nn(createCrdtOp.opId))
          }
          ops.push(...newAttachChildOps)
        } else {
          updatedProps[key] = newValue
          this._propToLastUpdate.set(key, opId)
        }
        this._map.set(key, newValue)
        this.invalidate()
        updateDelta[key] = { type: 'update' }
      }
      if (Object.keys(reverseUpdateOp.data).length !== 0) {
        reverseOps.unshift(reverseUpdateOp)
      }
      if (Object.keys(updatedProps).length !== 0) {
        ops.unshift({
          opId,
          id: this._id,
          type: 3,
          data: updatedProps
        })
      }
      const storageUpdates = /* @__PURE__ */ new Map()
      storageUpdates.set(this._id, {
        node: this,
        type: 'LiveObject',
        updates: updateDelta
      })
      this._pool.dispatch(ops, reverseOps, storageUpdates)
    }
    toImmutable() {
      return super.toImmutable()
    }
    /** @internal */
    toTreeNode(key) {
      return super.toTreeNode(key)
    }
    /** @internal */
    _toTreeNode(key) {
      const nodeId = this._id ?? nanoid()
      return {
        type: 'LiveObject',
        id: nodeId,
        key,
        payload: Array.from(this._map.entries()).map(([key2, value]) =>
          isLiveNode(value)
            ? value.toTreeNode(key2)
            : {
                type: 'Json',
                id: `${nodeId}:${key2}`,
                key: key2,
                payload: value
              }
        )
      }
    }
    /** @internal */
    _toImmutable() {
      const result = {}
      for (const [key, val] of this._map) {
        result[key] = isLiveStructure(val) ? val.toImmutable() : val
      }
      return false ? result : Object.freeze(result)
    }
  }
  function creationOpToLiveNode(op) {
    return lsonToLiveNode(creationOpToLson(op))
  }
  function creationOpToLson(op) {
    switch (op.type) {
      case 8:
        return op.data
      case 4:
        return new LiveObject(op.data)
      case 7:
        return new LiveMap()
      case 2:
        return new LiveList()
      default:
        return assertNever(op, 'Unknown creation Op')
    }
  }
  function isSameNodeOrChildOf(node, parent) {
    if (node === parent) {
      return true
    }
    if (node.parent.type === 'HasParent') {
      return isSameNodeOrChildOf(node.parent.node, parent)
    }
    return false
  }
  function deserialize([id, crdt], parentToChildren, pool) {
    switch (crdt.type) {
      case 0: {
        return LiveObject._deserialize([id, crdt], parentToChildren, pool)
      }
      case 1: {
        return LiveList._deserialize([id, crdt], parentToChildren, pool)
      }
      case 2: {
        return LiveMap._deserialize([id, crdt], parentToChildren, pool)
      }
      case 3: {
        return LiveRegister._deserialize([id, crdt], parentToChildren, pool)
      }
      default: {
        throw new Error('Unexpected CRDT type')
      }
    }
  }
  function deserializeToLson([id, crdt], parentToChildren, pool) {
    switch (crdt.type) {
      case 0: {
        return LiveObject._deserialize([id, crdt], parentToChildren, pool)
      }
      case 1: {
        return LiveList._deserialize([id, crdt], parentToChildren, pool)
      }
      case 2: {
        return LiveMap._deserialize([id, crdt], parentToChildren, pool)
      }
      case 3: {
        return crdt.data
      }
      default: {
        throw new Error('Unexpected CRDT type')
      }
    }
  }
  function isLiveStructure(value) {
    return isLiveList(value) || isLiveMap(value) || isLiveObject(value)
  }
  function isLiveNode(value) {
    return isLiveStructure(value) || isLiveRegister(value)
  }
  function isLiveList(value) {
    return value instanceof LiveList
  }
  function isLiveMap(value) {
    return value instanceof LiveMap
  }
  function isLiveObject(value) {
    return value instanceof LiveObject
  }
  function isLiveRegister(value) {
    return value instanceof LiveRegister
  }
  function liveNodeToLson(obj) {
    if (obj instanceof LiveRegister) {
      return obj.data
    } else if (
      obj instanceof LiveList ||
      obj instanceof LiveMap ||
      obj instanceof LiveObject
    ) {
      return obj
    } else {
      return assertNever(obj, 'Unknown AbstractCrdt')
    }
  }
  function lsonToLiveNode(value) {
    if (
      value instanceof LiveObject ||
      value instanceof LiveMap ||
      value instanceof LiveList
    ) {
      return value
    } else {
      return new LiveRegister(value)
    }
  }
  function getTreesDiffOperations(currentItems, newItems) {
    const ops = []
    currentItems.forEach((_, id) => {
      if (!newItems.get(id)) {
        ops.push({
          type: 5,
          id
        })
      }
    })
    newItems.forEach((crdt, id) => {
      const currentCrdt = currentItems.get(id)
      if (currentCrdt) {
        if (crdt.type === 0) {
          if (
            currentCrdt.type !== 0 ||
            JSON.stringify(crdt.data) !== JSON.stringify(currentCrdt.data)
          ) {
            ops.push({
              type: 3,
              id,
              data: crdt.data
            })
          }
        }
        if (crdt.parentKey !== currentCrdt.parentKey) {
          ops.push({
            type: 1,
            id,
            parentKey: nn(crdt.parentKey, 'Parent key must not be missing')
          })
        }
      } else {
        switch (crdt.type) {
          case 3:
            ops.push({
              type: 8,
              id,
              parentId: crdt.parentId,
              parentKey: crdt.parentKey,
              data: crdt.data
            })
            break
          case 1:
            ops.push({
              type: 2,
              id,
              parentId: crdt.parentId,
              parentKey: crdt.parentKey
            })
            break
          case 0:
            ops.push(
              crdt.parentId
                ? {
                    type: 4,
                    id,
                    parentId: crdt.parentId,
                    parentKey: crdt.parentKey,
                    data: crdt.data
                  }
                : // Root object
                  { type: 4, id, data: crdt.data }
            )
            break
          case 2:
            ops.push({
              type: 7,
              id,
              parentId: crdt.parentId,
              parentKey: crdt.parentKey
            })
            break
        }
      }
    })
    return ops
  }
  function mergeObjectStorageUpdates(first, second) {
    const updates = first.updates
    for (const [key, value] of entries(second.updates)) {
      updates[key] = value
    }
    return {
      ...second,
      updates
    }
  }
  function mergeMapStorageUpdates(first, second) {
    const updates = first.updates
    for (const [key, value] of entries(second.updates)) {
      updates[key] = value
    }
    return {
      ...second,
      updates
    }
  }
  function mergeListStorageUpdates(first, second) {
    const updates = first.updates
    return {
      ...second,
      updates: updates.concat(second.updates)
    }
  }
  function mergeStorageUpdates(first, second) {
    if (first === void 0) {
      return second
    }
    if (first.type === 'LiveObject' && second.type === 'LiveObject') {
      return mergeObjectStorageUpdates(first, second)
    } else if (first.type === 'LiveMap' && second.type === 'LiveMap') {
      return mergeMapStorageUpdates(first, second)
    } else if (first.type === 'LiveList' && second.type === 'LiveList') {
      return mergeListStorageUpdates(first, second)
    } else {
    }
    return second
  }
  function captureStackTrace(msg, traceRoot) {
    const errorLike = { name: msg }
    if (typeof Error.captureStackTrace !== 'function') {
      return void 0
    }
    Error.captureStackTrace(errorLike, traceRoot)
    return errorLike.stack
  }
  function isJsonScalar(data) {
    return (
      data === null ||
      typeof data === 'string' ||
      typeof data === 'number' ||
      typeof data === 'boolean'
    )
  }
  function isJsonArray(data) {
    return Array.isArray(data)
  }
  function isJsonObject(data) {
    return !isJsonScalar(data) && !isJsonArray(data)
  }
  function isStringList(value) {
    return Array.isArray(value) && value.every(i => typeof i === 'string')
  }
  function isMinimalTokenPayload(data) {
    return (
      isPlainObject(data) &&
      typeof data.actor === 'number' &&
      (data.id === void 0 || typeof data.id === 'string') &&
      isStringList(data.scopes)
    )
  }
  function parseAuthToken(rawTokenString) {
    const tokenParts = rawTokenString.split('.')
    if (tokenParts.length !== 3) {
      throw new Error('Authentication error: invalid JWT token')
    }
    const payload = tryParseJson(b64decode(tokenParts[1]))
    if (!(payload && isMinimalTokenPayload(payload))) {
      throw new Error(
        'Authentication error: we expected a room token but did not get one. Hint: if you are using a callback, ensure the room is passed when creating the token. For more information: https://liveblocks.io/docs/api-reference/liveblocks-client#createClientCallback'
      )
    }
    return {
      raw: rawTokenString,
      parsed: payload
    }
  }
  function asArrayWithLegacyMethods(arr) {
    Object.defineProperty(arr, 'count', {
      value: arr.length,
      enumerable: false
    })
    Object.defineProperty(arr, 'toArray', {
      value: () => arr,
      enumerable: false
    })
    return freeze(arr)
  }
  function merge(target, patch) {
    let updated = false
    const newValue = { ...target }
    Object.keys(patch).forEach(k => {
      const key = k
      const val = patch[key]
      if (newValue[key] !== val) {
        if (val === void 0) {
          delete newValue[key]
        } else {
          newValue[key] = val
        }
        updated = true
      }
    })
    return updated ? newValue : target
  }
  var ImmutableRef = class {
    constructor() {
      this._ev = makeEventSource()
    }
    get didInvalidate() {
      return this._ev.observable
    }
    invalidate() {
      if (this._cache !== void 0) {
        this._cache = void 0
        this._ev.notify()
      }
    }
    get current() {
      return this._cache ?? (this._cache = this._toImmutable())
    }
  }
  function makeUser(conn, presence) {
    return freeze(compactObject({ ...conn, presence }))
  }
  var OthersRef = class extends ImmutableRef {
    //
    // --------------------------------------------------------------
    //
    constructor() {
      super()
      this._connections = {}
      this._presences = {}
      this._users = {}
    }
    /** @internal */
    _toImmutable() {
      const users = compact(
        Object.keys(this._presences).map(connectionId =>
          this.getUser(Number(connectionId))
        )
      )
      return asArrayWithLegacyMethods(users)
    }
    clearOthers() {
      this._connections = {}
      this._presences = {}
      this._users = {}
      this.invalidate()
    }
    /** @internal */
    _getUser(connectionId) {
      const conn = this._connections[connectionId]
      const presence = this._presences[connectionId]
      if (conn !== void 0 && presence !== void 0) {
        return makeUser(conn, presence)
      }
      return void 0
    }
    getUser(connectionId) {
      const cachedUser = this._users[connectionId]
      if (cachedUser) {
        return cachedUser
      }
      const computedUser = this._getUser(connectionId)
      if (computedUser) {
        this._users[connectionId] = computedUser
        return computedUser
      }
      return void 0
    }
    /** @internal */
    _invalidateUser(connectionId) {
      if (this._users[connectionId] !== void 0) {
        delete this._users[connectionId]
      }
      this.invalidate()
    }
    /**
     * Records a known connection. This records the connection ID and the
     * associated metadata.
     */
    setConnection(connectionId, metaUserId, metaUserInfo, metaIsReadonly) {
      this._connections[connectionId] = freeze({
        connectionId,
        id: metaUserId,
        info: metaUserInfo,
        isReadOnly: metaIsReadonly
      })
      if (this._presences[connectionId] !== void 0) {
        this._invalidateUser(connectionId)
      }
    }
    /**
     * Removes a known connectionId. Removes both the connection's metadata and
     * the presence information.
     */
    removeConnection(connectionId) {
      delete this._connections[connectionId]
      delete this._presences[connectionId]
      this._invalidateUser(connectionId)
    }
    /**
     * Stores a new user from a full presence update. If the user already exists,
     * its known presence data is overwritten.
     */
    setOther(connectionId, presence) {
      this._presences[connectionId] = freeze(compactObject(presence))
      if (this._connections[connectionId] !== void 0) {
        this._invalidateUser(connectionId)
      }
    }
    /**
     * Patches the presence data for an existing "other". If we don't know the
     * initial presence data for this user yet, discard this patch and await the
     * full .setOther() call first.
     */
    patchOther(connectionId, patch) {
      const oldPresence = this._presences[connectionId]
      if (oldPresence === void 0) {
        return
      }
      const newPresence = merge(oldPresence, patch)
      if (oldPresence !== newPresence) {
        this._presences[connectionId] = freeze(newPresence)
        this._invalidateUser(connectionId)
      }
    }
  }
  var PatchableRef = class extends ImmutableRef {
    constructor(data) {
      super()
      this._data = freeze(compactObject(data))
    }
    /** @internal */
    _toImmutable() {
      return this._data
    }
    /**
     * Patches the current object.
     */
    patch(patch) {
      const oldData = this._data
      const newData = merge(oldData, patch)
      if (oldData !== newData) {
        this._data = freeze(newData)
        this.invalidate()
      }
    }
  }
  var ValueRef = class extends ImmutableRef {
    constructor(initialValue) {
      super()
      this._value = freeze(initialValue)
    }
    /** @internal */
    _toImmutable() {
      return this._value
    }
    set(newValue) {
      this._value = freeze(newValue)
      this.invalidate()
    }
  }
  var DerivedRef = class extends ImmutableRef {
    constructor(...args) {
      super()
      const transformFn = args.pop()
      const otherRefs = args
      this._refs = otherRefs
      this._refs.forEach(ref => {
        ref.didInvalidate.subscribe(() => this.invalidate())
      })
      this._transform = transformFn
    }
    /** @internal */
    _toImmutable() {
      return this._transform(...this._refs.map(ref => ref.current))
    }
  }
  var MAX_MESSAGE_SIZE = 1024 * 1024 - 128
  function makeIdFactory(connectionId) {
    let count = 0
    return () => `${connectionId}:${count++}`
  }
  function userToTreeNode(key, user) {
    return {
      type: 'User',
      id: `${user.connectionId}`,
      key,
      payload: user
    }
  }
  function createRoom(options, config) {
    const initialPresence =
      typeof options.initialPresence === 'function'
        ? options.initialPresence(config.roomId)
        : options.initialPresence
    const initialStorage =
      typeof options.initialStorage === 'function'
        ? options.initialStorage(config.roomId)
        : options.initialStorage
    const delegates = config.delegates ?? {
      authenticate: makeAuthDelegateForRoom(
        config.roomId,
        config.authentication,
        config.polyfills?.fetch
      ),
      createSocket: makeCreateSocketDelegateForRoom(
        config.liveblocksServer,
        config.polyfills?.WebSocket
      )
    }
    const managedSocket = new ManagedSocket(
      delegates,
      config.enableDebugLogging
    )
    const context = {
      buffer: {
        flushTimerID: void 0,
        lastFlushedAt: 0,
        presenceUpdates:
          // Queue up the initial presence message as a Full Presence™ update
          {
            type: 'full',
            data: initialPresence
          },
        messages: [],
        storageOperations: []
      },
      sessionInfo: new ValueRef(null),
      me: new PatchableRef(initialPresence),
      others: new OthersRef(),
      initialStorage,
      idFactory: null,
      // Storage
      clock: 0,
      opClock: 0,
      nodes: /* @__PURE__ */ new Map(),
      root: void 0,
      undoStack: [],
      redoStack: [],
      pausedHistory: null,
      activeBatch: null,
      unacknowledgedOps: /* @__PURE__ */ new Map(),
      // Debug
      opStackTraces: true ? /* @__PURE__ */ new Map() : void 0
    }
    const doNotBatchUpdates = cb => cb()
    const batchUpdates = config.unstable_batchedUpdates ?? doNotBatchUpdates
    let lastToken
    function onStatusDidChange(newStatus) {
      const token = managedSocket.token?.parsed
      if (token !== void 0 && token !== lastToken) {
        context.sessionInfo.set({
          userInfo: token.info,
          userId: token.id,
          // NOTE: In the future, these fields will get assigned in the connection phase
          actor: token.actor,
          isReadOnly: isStorageReadOnly(token.scopes)
        })
        lastToken = token
      }
      batchUpdates(() => {
        eventHub.status.notify(newStatus)
        eventHub.connection.notify(newToLegacyStatus(newStatus))
        notifySelfChanged(doNotBatchUpdates)
      })
    }
    let _connectionLossTimerId
    let _hasLostConnection = false
    function handleConnectionLossEvent(newStatus) {
      if (newStatus === 'reconnecting') {
        _connectionLossTimerId = setTimeout(() => {
          batchUpdates(() => {
            eventHub.lostConnection.notify('lost')
            _hasLostConnection = true
            context.others.clearOthers()
            notify({ others: [{ type: 'reset' }] }, doNotBatchUpdates)
          })
        }, config.lostConnectionTimeout)
      } else {
        clearTimeout(_connectionLossTimerId)
        if (_hasLostConnection) {
          if (newStatus === 'disconnected') {
            batchUpdates(() => {
              eventHub.lostConnection.notify('failed')
            })
          } else {
            batchUpdates(() => {
              eventHub.lostConnection.notify('restored')
            })
          }
          _hasLostConnection = false
        }
      }
    }
    function onDidConnect() {
      const sessionInfo = context.sessionInfo.current
      if (sessionInfo === null) {
        throw new Error('Unexpected missing session info')
      }
      context.buffer.presenceUpdates = {
        type: 'full',
        data:
          // Because context.me.current is a readonly object, we'll have to
          // make a copy here. Otherwise, type errors happen later when
          // "patching" my presence.
          { ...context.me.current }
      }
      context.idFactory = makeIdFactory(sessionInfo.actor)
      if (_getStorage$ !== null) {
        refreshStorage({ flush: false })
      }
      flushNowOrSoon()
    }
    function onDidDisconnect() {
      clearTimeout(context.buffer.flushTimerID)
    }
    managedSocket.events.onMessage.subscribe(handleServerMessage)
    managedSocket.events.statusDidChange.subscribe(onStatusDidChange)
    managedSocket.events.statusDidChange.subscribe(handleConnectionLossEvent)
    managedSocket.events.didConnect.subscribe(onDidConnect)
    managedSocket.events.didDisconnect.subscribe(onDidDisconnect)
    managedSocket.events.onLiveblocksError.subscribe(err => {
      batchUpdates(() => {
        if (true) {
          error2(
            `Connection to websocket server closed. Reason: ${err.message} (code: ${err.code}).`
          )
        }
        eventHub.error.notify(err)
      })
    })
    const pool = {
      roomId: config.roomId,
      getNode: id => context.nodes.get(id),
      addNode: (id, node) => void context.nodes.set(id, node),
      deleteNode: id => void context.nodes.delete(id),
      generateId: () => `${getConnectionId()}:${context.clock++}`,
      generateOpId: () => `${getConnectionId()}:${context.opClock++}`,
      dispatch(ops, reverse, storageUpdates) {
        const activeBatch = context.activeBatch
        if (true) {
          const stackTrace = captureStackTrace(
            'Storage mutation',
            this.dispatch
          )
          if (stackTrace) {
            for (const op of ops) {
              if (op.opId) {
                nn(context.opStackTraces).set(op.opId, stackTrace)
              }
            }
          }
        }
        if (activeBatch) {
          activeBatch.ops.push(...ops)
          for (const [key, value] of storageUpdates) {
            activeBatch.updates.storageUpdates.set(
              key,
              mergeStorageUpdates(
                activeBatch.updates.storageUpdates.get(key),
                value
              )
            )
          }
          activeBatch.reverseOps.unshift(...reverse)
        } else {
          batchUpdates(() => {
            addToUndoStack(reverse, doNotBatchUpdates)
            context.redoStack = []
            dispatchOps(ops)
            notify({ storageUpdates }, doNotBatchUpdates)
          })
        }
      },
      assertStorageIsWritable: () => {
        if (context.sessionInfo.current?.isReadOnly) {
          throw new Error(
            'Cannot write to storage with a read only user, please ensure the user has write permissions'
          )
        }
      }
    }
    const eventHub = {
      connection: makeEventSource(),
      // Old/deprecated API
      status: makeEventSource(),
      // New/recommended API
      lostConnection: makeEventSource(),
      customEvent: makeEventSource(),
      self: makeEventSource(),
      myPresence: makeEventSource(),
      others: makeEventSource(),
      error: makeEventSource(),
      storage: makeEventSource(),
      history: makeEventSource(),
      storageDidLoad: makeEventSource(),
      storageStatus: makeEventSource(),
      ydoc: makeEventSource()
    }
    function sendMessages(messageOrMessages) {
      const message = JSON.stringify(messageOrMessages)
      if (config.unstable_fallbackToHTTP) {
        const size = new TextEncoder().encode(message).length
        if (
          size > MAX_MESSAGE_SIZE &&
          managedSocket.token?.raw &&
          config.httpSendEndpoint
        ) {
          void httpSend(
            message,
            managedSocket.token.raw,
            config.httpSendEndpoint,
            config.polyfills?.fetch
          ).then(resp => {
            if (!resp.ok && resp.status === 403) {
              managedSocket.reconnect()
            }
          })
          warn(
            'Message was too large for websockets and sent over HTTP instead'
          )
          return
        }
      }
      managedSocket.send(message)
    }
    const self = new DerivedRef(context.sessionInfo, context.me, (info, me) => {
      return info !== null
        ? {
            connectionId: info.actor,
            id: info.userId,
            info: info.userInfo,
            presence: me,
            isReadOnly: info.isReadOnly
          }
        : null
    })
    let _lastSelf
    function notifySelfChanged(batchedUpdatesWrapper) {
      const currSelf = self.current
      if (currSelf !== null && currSelf !== _lastSelf) {
        batchedUpdatesWrapper(() => {
          eventHub.self.notify(currSelf)
        })
        _lastSelf = currSelf
      }
    }
    const selfAsTreeNode = new DerivedRef(self, me =>
      me !== null ? userToTreeNode('Me', me) : null
    )
    function createOrUpdateRootFromMessage(message, batchedUpdatesWrapper) {
      if (message.items.length === 0) {
        throw new Error('Internal error: cannot load storage without items')
      }
      if (context.root !== void 0) {
        updateRoot(message.items, batchedUpdatesWrapper)
      } else {
        context.root = LiveObject._fromItems(message.items, pool)
      }
      for (const key in context.initialStorage) {
        if (context.root.get(key) === void 0) {
          context.root.set(key, context.initialStorage[key])
        }
      }
    }
    function updateRoot(items, batchedUpdatesWrapper) {
      if (context.root === void 0) {
        return
      }
      const currentItems = /* @__PURE__ */ new Map()
      for (const [id, node] of context.nodes) {
        currentItems.set(id, node._serialize())
      }
      const ops = getTreesDiffOperations(currentItems, new Map(items))
      const result = applyOps(ops, false)
      notify(result.updates, batchedUpdatesWrapper)
    }
    function _addToRealUndoStack(historyOps, batchedUpdatesWrapper) {
      if (context.undoStack.length >= 50) {
        context.undoStack.shift()
      }
      context.undoStack.push(historyOps)
      onHistoryChange(batchedUpdatesWrapper)
    }
    function addToUndoStack(historyOps, batchedUpdatesWrapper) {
      if (context.pausedHistory !== null) {
        context.pausedHistory.unshift(...historyOps)
      } else {
        _addToRealUndoStack(historyOps, batchedUpdatesWrapper)
      }
    }
    function notify(
      {
        storageUpdates = /* @__PURE__ */ new Map(),
        presence = false,
        others: otherEvents = []
      },
      batchedUpdatesWrapper
    ) {
      batchedUpdatesWrapper(() => {
        if (otherEvents.length > 0) {
          const others = context.others.current
          for (const event of otherEvents) {
            eventHub.others.notify({ others, event })
          }
        }
        if (presence) {
          notifySelfChanged(doNotBatchUpdates)
          eventHub.myPresence.notify(context.me.current)
        }
        if (storageUpdates.size > 0) {
          const updates = Array.from(storageUpdates.values())
          eventHub.storage.notify(updates)
        }
        notifyStorageStatus()
      })
    }
    function getConnectionId() {
      const info = context.sessionInfo.current
      if (info) {
        return info.actor
      }
      throw new Error(
        'Internal. Tried to get connection id but connection was never open'
      )
    }
    function applyOps(rawOps, isLocal) {
      const output = {
        reverse: [],
        storageUpdates: /* @__PURE__ */ new Map(),
        presence: false
      }
      const createdNodeIds = /* @__PURE__ */ new Set()
      const ops = rawOps.map(op => {
        if (op.type !== 'presence' && !op.opId) {
          return { ...op, opId: pool.generateOpId() }
        } else {
          return op
        }
      })
      for (const op of ops) {
        if (op.type === 'presence') {
          const reverse = {
            type: 'presence',
            data: {}
          }
          for (const key in op.data) {
            reverse.data[key] = context.me.current[key]
          }
          context.me.patch(op.data)
          if (context.buffer.presenceUpdates === null) {
            context.buffer.presenceUpdates = { type: 'partial', data: op.data }
          } else {
            for (const key in op.data) {
              context.buffer.presenceUpdates.data[key] = op.data[key]
            }
          }
          output.reverse.unshift(reverse)
          output.presence = true
        } else {
          let source
          if (isLocal) {
            source = 0
          } else {
            const opId = nn(op.opId)
            if (true) {
              nn(context.opStackTraces).delete(opId)
            }
            const deleted = context.unacknowledgedOps.delete(opId)
            source = deleted ? 2 : 1
          }
          const applyOpResult = applyOp(op, source)
          if (applyOpResult.modified) {
            const nodeId = applyOpResult.modified.node._id
            if (!(nodeId && createdNodeIds.has(nodeId))) {
              output.storageUpdates.set(
                nn(applyOpResult.modified.node._id),
                mergeStorageUpdates(
                  output.storageUpdates.get(
                    nn(applyOpResult.modified.node._id)
                  ),
                  applyOpResult.modified
                )
              )
              output.reverse.unshift(...applyOpResult.reverse)
            }
            if (op.type === 2 || op.type === 7 || op.type === 4) {
              createdNodeIds.add(nn(op.id))
            }
          }
        }
      }
      return {
        ops,
        reverse: output.reverse,
        updates: {
          storageUpdates: output.storageUpdates,
          presence: output.presence
        }
      }
    }
    function applyOp(op, source) {
      if (isAckOp(op)) {
        return { modified: false }
      }
      switch (op.type) {
        case 6:
        case 3:
        case 5: {
          const node = context.nodes.get(op.id)
          if (node === void 0) {
            return { modified: false }
          }
          return node._apply(
            op,
            source === 0
            /* UNDOREDO_RECONNECT */
          )
        }
        case 1: {
          const node = context.nodes.get(op.id)
          if (node === void 0) {
            return { modified: false }
          }
          if (
            node.parent.type === 'HasParent' &&
            isLiveList(node.parent.node)
          ) {
            return node.parent.node._setChildKey(
              asPos(op.parentKey),
              node,
              source
            )
          }
          return { modified: false }
        }
        case 4:
        case 2:
        case 7:
        case 8: {
          if (op.parentId === void 0) {
            return { modified: false }
          }
          const parentNode = context.nodes.get(op.parentId)
          if (parentNode === void 0) {
            return { modified: false }
          }
          return parentNode._attachChild(op, source)
        }
      }
    }
    function updatePresence(patch, options2) {
      const oldValues = {}
      if (context.buffer.presenceUpdates === null) {
        context.buffer.presenceUpdates = {
          type: 'partial',
          data: {}
        }
      }
      for (const key in patch) {
        const overrideValue = patch[key]
        if (overrideValue === void 0) {
          continue
        }
        context.buffer.presenceUpdates.data[key] = overrideValue
        oldValues[key] = context.me.current[key]
      }
      context.me.patch(patch)
      if (context.activeBatch) {
        if (options2?.addToHistory) {
          context.activeBatch.reverseOps.unshift({
            type: 'presence',
            data: oldValues
          })
        }
        context.activeBatch.updates.presence = true
      } else {
        flushNowOrSoon()
        batchUpdates(() => {
          if (options2?.addToHistory) {
            addToUndoStack(
              [{ type: 'presence', data: oldValues }],
              doNotBatchUpdates
            )
          }
          notify({ presence: true }, doNotBatchUpdates)
        })
      }
    }
    function isStorageReadOnly(scopes) {
      return (
        scopes.includes(
          'room:read'
          /* Read */
        ) &&
        scopes.includes(
          'room:presence:write'
          /* PresenceWrite */
        ) &&
        !scopes.includes(
          'room:write'
          /* Write */
        )
      )
    }
    function onUpdatePresenceMessage(message) {
      if (message.targetActor !== void 0) {
        const oldUser = context.others.getUser(message.actor)
        context.others.setOther(message.actor, message.data)
        const newUser = context.others.getUser(message.actor)
        if (oldUser === void 0 && newUser !== void 0) {
          return { type: 'enter', user: newUser }
        }
      } else {
        context.others.patchOther(message.actor, message.data), message
      }
      const user = context.others.getUser(message.actor)
      if (user) {
        return {
          type: 'update',
          updates: message.data,
          user
        }
      } else {
        return void 0
      }
    }
    function onUserLeftMessage(message) {
      const user = context.others.getUser(message.actor)
      if (user) {
        context.others.removeConnection(message.actor)
        return { type: 'leave', user }
      }
      return null
    }
    function onRoomStateMessage(message) {
      for (const connectionId in context.others._connections) {
        const user = message.users[connectionId]
        if (user === void 0) {
          context.others.removeConnection(Number(connectionId))
        }
      }
      for (const key in message.users) {
        const user = message.users[key]
        const connectionId = Number(key)
        context.others.setConnection(
          connectionId,
          user.id,
          user.info,
          isStorageReadOnly(user.scopes)
        )
      }
      return { type: 'reset' }
    }
    function canUndo() {
      return context.undoStack.length > 0
    }
    function canRedo() {
      return context.redoStack.length > 0
    }
    function onHistoryChange(batchedUpdatesWrapper) {
      batchedUpdatesWrapper(() => {
        eventHub.history.notify({ canUndo: canUndo(), canRedo: canRedo() })
      })
    }
    function onUserJoinedMessage(message) {
      context.others.setConnection(
        message.actor,
        message.id,
        message.info,
        isStorageReadOnly(message.scopes)
      )
      context.buffer.messages.push({
        type: 100,
        data: context.me.current,
        targetActor: message.actor
      })
      flushNowOrSoon()
      const user = context.others.getUser(message.actor)
      return user ? { type: 'enter', user } : void 0
    }
    function parseServerMessage(data) {
      if (!isJsonObject(data)) {
        return null
      }
      return data
    }
    function parseServerMessages(text) {
      const data = tryParseJson(text)
      if (data === void 0) {
        return null
      } else if (isJsonArray(data)) {
        return compact(data.map(item => parseServerMessage(item)))
      } else {
        return compact([parseServerMessage(data)])
      }
    }
    function applyAndSendOps(offlineOps, batchedUpdatesWrapper) {
      if (offlineOps.size === 0) {
        return
      }
      const messages = []
      const ops = Array.from(offlineOps.values())
      const result = applyOps(ops, true)
      messages.push({
        type: 201,
        ops: result.ops
      })
      notify(result.updates, batchedUpdatesWrapper)
      sendMessages(messages)
    }
    function handleServerMessage(event) {
      if (typeof event.data !== 'string') {
        return
      }
      const messages = parseServerMessages(event.data)
      if (messages === null || messages.length === 0) {
        return
      }
      const updates = {
        storageUpdates: /* @__PURE__ */ new Map(),
        others: []
      }
      batchUpdates(() => {
        for (const message of messages) {
          switch (message.type) {
            case 101: {
              const userJoinedUpdate = onUserJoinedMessage(message)
              if (userJoinedUpdate) {
                updates.others.push(userJoinedUpdate)
              }
              break
            }
            case 100: {
              const othersPresenceUpdate = onUpdatePresenceMessage(message)
              if (othersPresenceUpdate) {
                updates.others.push(othersPresenceUpdate)
              }
              break
            }
            case 103: {
              eventHub.customEvent.notify({
                connectionId: message.actor,
                event: message.event
              })
              break
            }
            case 102: {
              const event2 = onUserLeftMessage(message)
              if (event2) {
                updates.others.push(event2)
              }
              break
            }
            case 300: {
              eventHub.ydoc.notify(message)
              break
            }
            case 104: {
              updates.others.push(onRoomStateMessage(message))
              break
            }
            case 200: {
              const unacknowledgedOps = new Map(context.unacknowledgedOps)
              createOrUpdateRootFromMessage(message, doNotBatchUpdates)
              applyAndSendOps(unacknowledgedOps, doNotBatchUpdates)
              _resolveStoragePromise?.()
              notifyStorageStatus()
              eventHub.storageDidLoad.notify()
              break
            }
            case 201: {
              const applyResult = applyOps(message.ops, false)
              for (const [key, value] of applyResult.updates.storageUpdates) {
                updates.storageUpdates.set(
                  key,
                  mergeStorageUpdates(updates.storageUpdates.get(key), value)
                )
              }
              break
            }
            case 299: {
              errorWithTitle('Storage mutation rejection error', message.reason)
              if (true) {
                const traces = /* @__PURE__ */ new Set()
                for (const opId of message.opIds) {
                  const trace = context.opStackTraces?.get(opId)
                  if (trace) {
                    traces.add(trace)
                  }
                }
                if (traces.size > 0) {
                  warnWithTitle(
                    'The following function calls caused the rejected storage mutations:',
                    `

${Array.from(traces).join('\n\n')}`
                  )
                }
                throw new Error(
                  `Storage mutations rejected by server: ${message.reason}`
                )
              }
              break
            }
          }
        }
        notify(updates, doNotBatchUpdates)
      })
    }
    function flushNowOrSoon() {
      const storageOps = context.buffer.storageOperations
      if (storageOps.length > 0) {
        for (const op of storageOps) {
          context.unacknowledgedOps.set(nn(op.opId), op)
        }
        notifyStorageStatus()
      }
      if (managedSocket.getStatus() !== 'connected') {
        context.buffer.storageOperations = []
        return
      }
      const now = Date.now()
      const elapsedMillis = now - context.buffer.lastFlushedAt
      if (elapsedMillis > config.throttleDelay) {
        const messagesToFlush = serializeBuffer()
        if (messagesToFlush.length === 0) {
          return
        }
        sendMessages(messagesToFlush)
        context.buffer = {
          flushTimerID: void 0,
          lastFlushedAt: now,
          messages: [],
          storageOperations: [],
          presenceUpdates: null
        }
      } else {
        clearTimeout(context.buffer.flushTimerID)
        context.buffer.flushTimerID = setTimeout(
          flushNowOrSoon,
          config.throttleDelay - elapsedMillis
        )
      }
    }
    function serializeBuffer() {
      const messages = []
      if (context.buffer.presenceUpdates) {
        messages.push(
          context.buffer.presenceUpdates.type === 'full'
            ? {
                type: 100,
                // Populating the `targetActor` field turns this message into
                // a Full Presence™ update message (not a patch), which will get
                // interpreted by other clients as such.
                targetActor: -1,
                data: context.buffer.presenceUpdates.data
              }
            : {
                type: 100,
                data: context.buffer.presenceUpdates.data
              }
        )
      }
      for (const event of context.buffer.messages) {
        messages.push(event)
      }
      if (context.buffer.storageOperations.length > 0) {
        messages.push({
          type: 201,
          ops: context.buffer.storageOperations
        })
      }
      return messages
    }
    function updateYDoc(update) {
      context.buffer.messages.push({
        type: 301,
        update
      })
      flushNowOrSoon()
    }
    function broadcastEvent(
      event,
      options2 = {
        shouldQueueEventIfNotReady: false
      }
    ) {
      if (
        managedSocket.getStatus() !== 'connected' &&
        !options2.shouldQueueEventIfNotReady
      ) {
        return
      }
      context.buffer.messages.push({
        type: 103,
        event
      })
      flushNowOrSoon()
    }
    function dispatchOps(ops) {
      context.buffer.storageOperations.push(...ops)
      flushNowOrSoon()
    }
    let _getStorage$ = null
    let _resolveStoragePromise = null
    function refreshStorage(options2) {
      const messages = context.buffer.messages
      if (
        !messages.some(
          msg => msg.type === 200
          /* FETCH_STORAGE */
        )
      ) {
        messages.push({
          type: 200
          /* FETCH_STORAGE */
        })
      }
      if (options2.flush) {
        flushNowOrSoon()
      }
    }
    function startLoadingStorage() {
      if (_getStorage$ === null) {
        refreshStorage({ flush: true })
        _getStorage$ = new Promise(resolve => {
          _resolveStoragePromise = resolve
        })
        notifyStorageStatus()
      }
      return _getStorage$
    }
    function getStorageSnapshot() {
      const root = context.root
      if (root !== void 0) {
        return root
      } else {
        void startLoadingStorage()
        return null
      }
    }
    async function getStorage() {
      if (context.root !== void 0) {
        return Promise.resolve({
          root: context.root
        })
      }
      await startLoadingStorage()
      return {
        root: nn(context.root)
      }
    }
    function fetchYDoc(vector) {
      context.buffer.messages.push({
        type: 300,
        vector
      })
      flushNowOrSoon()
    }
    function undo() {
      if (context.activeBatch) {
        throw new Error('undo is not allowed during a batch')
      }
      const historyOps = context.undoStack.pop()
      if (historyOps === void 0) {
        return
      }
      context.pausedHistory = null
      const result = applyOps(historyOps, true)
      batchUpdates(() => {
        notify(result.updates, doNotBatchUpdates)
        context.redoStack.push(result.reverse)
        onHistoryChange(doNotBatchUpdates)
      })
      for (const op of result.ops) {
        if (op.type !== 'presence') {
          context.buffer.storageOperations.push(op)
        }
      }
      flushNowOrSoon()
    }
    function redo() {
      if (context.activeBatch) {
        throw new Error('redo is not allowed during a batch')
      }
      const historyOps = context.redoStack.pop()
      if (historyOps === void 0) {
        return
      }
      context.pausedHistory = null
      const result = applyOps(historyOps, true)
      batchUpdates(() => {
        notify(result.updates, doNotBatchUpdates)
        context.undoStack.push(result.reverse)
        onHistoryChange(doNotBatchUpdates)
      })
      for (const op of result.ops) {
        if (op.type !== 'presence') {
          context.buffer.storageOperations.push(op)
        }
      }
      flushNowOrSoon()
    }
    function batch(callback) {
      if (context.activeBatch) {
        return callback()
      }
      let returnValue = void 0
      batchUpdates(() => {
        context.activeBatch = {
          ops: [],
          updates: {
            storageUpdates: /* @__PURE__ */ new Map(),
            presence: false,
            others: []
          },
          reverseOps: []
        }
        try {
          returnValue = callback()
        } finally {
          const currentBatch = context.activeBatch
          context.activeBatch = null
          if (currentBatch.reverseOps.length > 0) {
            addToUndoStack(currentBatch.reverseOps, doNotBatchUpdates)
          }
          if (currentBatch.ops.length > 0) {
            context.redoStack = []
          }
          if (currentBatch.ops.length > 0) {
            dispatchOps(currentBatch.ops)
          }
          notify(currentBatch.updates, doNotBatchUpdates)
          flushNowOrSoon()
        }
      })
      return returnValue
    }
    function pauseHistory() {
      context.pausedHistory = []
    }
    function resumeHistory() {
      const historyOps = context.pausedHistory
      context.pausedHistory = null
      if (historyOps !== null && historyOps.length > 0) {
        _addToRealUndoStack(historyOps, batchUpdates)
      }
    }
    function getStorageStatus() {
      if (context.root === void 0) {
        return _getStorage$ === null ? 'not-loaded' : 'loading'
      } else {
        return context.unacknowledgedOps.size === 0
          ? 'synchronized'
          : 'synchronizing'
      }
    }
    let _lastStorageStatus = getStorageStatus()
    function notifyStorageStatus() {
      const storageStatus = getStorageStatus()
      if (_lastStorageStatus !== storageStatus) {
        _lastStorageStatus = storageStatus
        eventHub.storageStatus.notify(storageStatus)
      }
    }
    const others_forDevTools = new DerivedRef(context.others, others =>
      others.map((other, index) => userToTreeNode(`Other ${index}`, other))
    )
    const events = {
      connection: eventHub.connection.observable,
      // Old/deprecated API
      status: eventHub.status.observable,
      // New/recommended API
      lostConnection: eventHub.lostConnection.observable,
      customEvent: eventHub.customEvent.observable,
      others: eventHub.others.observable,
      self: eventHub.self.observable,
      myPresence: eventHub.myPresence.observable,
      error: eventHub.error.observable,
      storage: eventHub.storage.observable,
      history: eventHub.history.observable,
      storageDidLoad: eventHub.storageDidLoad.observable,
      storageStatus: eventHub.storageStatus.observable,
      ydoc: eventHub.ydoc.observable
    }
    return Object.defineProperty(
      {
        /* NOTE: Exposing __internal here only to allow testing implementation details in unit tests */
        __internal: {
          get presenceBuffer() {
            return deepClone(context.buffer.presenceUpdates?.data ?? null)
          },
          // prettier-ignore
          get undoStack() {
            return deepClone(context.undoStack);
          },
          // prettier-ignore
          get nodeCount() {
            return context.nodes.size;
          },
          // prettier-ignore
          // Support for the Liveblocks browser extension
          getSelf_forDevTools: () => selfAsTreeNode.current,
          getOthers_forDevTools: () => others_forDevTools.current,
          // prettier-ignore
          send: {
            // These exist only for our E2E testing app
            explicitClose: (event) => managedSocket._privateSendMachineEvent({ type: "EXPLICIT_SOCKET_CLOSE", event }),
            implicitClose: () => managedSocket._privateSendMachineEvent({ type: "NAVIGATOR_OFFLINE" })
          }
        },
        id: config.roomId,
        subscribe: makeClassicSubscribeFn(events),
        connect: () => managedSocket.connect(),
        reconnect: () => managedSocket.reconnect(),
        disconnect: () => managedSocket.disconnect(),
        destroy: () => managedSocket.destroy(),
        // Presence
        updatePresence,
        updateYDoc,
        broadcastEvent,
        // Storage
        batch,
        history: {
          undo,
          redo,
          canUndo,
          canRedo,
          pause: pauseHistory,
          resume: resumeHistory
        },
        fetchYDoc,
        getStorage,
        getStorageSnapshot,
        getStorageStatus,
        events,
        // Core
        getStatus: () => managedSocket.getStatus(),
        getConnectionState: () => managedSocket.getLegacyStatus(),
        isSelfAware: () => context.sessionInfo.current !== null,
        getSelf: () => self.current,
        // Presence
        getPresence: () => context.me.current,
        getOthers: () => context.others.current
      },
      // Explictly make the __internal field non-enumerable, to avoid aggressive
      // freezing when used with Immer
      '__internal',
      { enumerable: false }
    )
  }
  function makeClassicSubscribeFn(events) {
    function subscribeToLiveStructureDeeply(node, callback) {
      return events.storage.subscribe(updates => {
        const relatedUpdates = updates.filter(update =>
          isSameNodeOrChildOf(update.node, node)
        )
        if (relatedUpdates.length > 0) {
          callback(relatedUpdates)
        }
      })
    }
    function subscribeToLiveStructureShallowly(node, callback) {
      return events.storage.subscribe(updates => {
        for (const update of updates) {
          if (update.node._id === node._id) {
            callback(update.node)
          }
        }
      })
    }
    function subscribe(first, second, options) {
      if (typeof first === 'string' && isRoomEventName(first)) {
        if (typeof second !== 'function') {
          throw new Error('Second argument must be a callback function')
        }
        const callback = second
        switch (first) {
          case 'event':
            return events.customEvent.subscribe(callback)
          case 'my-presence':
            return events.myPresence.subscribe(callback)
          case 'others': {
            const cb = callback
            return events.others.subscribe(({ others, event }) =>
              cb(others, event)
            )
          }
          case 'error':
            return events.error.subscribe(callback)
          case 'connection':
            return events.connection.subscribe(callback)
          case 'status':
            return events.status.subscribe(callback)
          case 'lost-connection':
            return events.lostConnection.subscribe(callback)
          case 'history':
            return events.history.subscribe(callback)
          case 'storage-status':
            return events.storageStatus.subscribe(callback)
          default:
            return assertNever(first, 'Unknown event')
        }
      }
      if (second === void 0 || typeof first === 'function') {
        if (typeof first === 'function') {
          const storageCallback = first
          return events.storage.subscribe(storageCallback)
        } else {
          throw new Error('Please specify a listener callback')
        }
      }
      if (isLiveNode(first)) {
        const node = first
        if (options?.isDeep) {
          const storageCallback = second
          return subscribeToLiveStructureDeeply(node, storageCallback)
        } else {
          const nodeCallback = second
          return subscribeToLiveStructureShallowly(node, nodeCallback)
        }
      }
      throw new Error(`"${String(first)}" is not a valid event name`)
    }
    return subscribe
  }
  function isRoomEventName(value) {
    return (
      value === 'my-presence' ||
      value === 'others' ||
      value === 'event' ||
      value === 'error' ||
      value === 'history' ||
      value === 'status' ||
      value === 'storage-status' ||
      value === 'lost-connection' ||
      value === 'connection'
    )
  }
  function makeCreateSocketDelegateForRoom(
    liveblocksServer,
    WebSocketPolyfill
  ) {
    return richToken => {
      const ws =
        WebSocketPolyfill ??
        (typeof WebSocket === 'undefined' ? void 0 : WebSocket)
      if (ws === void 0) {
        throw new StopRetrying(
          'To use Liveblocks client in a non-dom environment, you need to provide a WebSocket polyfill.'
        )
      }
      const token = richToken.raw
      return new ws(
        `${liveblocksServer}/?token=${token}&version=${PKG_VERSION || 'dev'}`
      )
    }
  }
  async function httpSend(message, token, endpoint, fetchPolyfill) {
    const fetcher = fetchPolyfill /* istanbul ignore next */ || fetch
    return fetcher(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: message
    })
  }
  function makeAuthDelegateForRoom(roomId, authentication, fetchPolyfill) {
    const fetcher =
      fetchPolyfill ?? (typeof window === 'undefined' ? void 0 : window.fetch)
    if (authentication.type === 'public') {
      return async () => {
        if (fetcher === void 0) {
          throw new StopRetrying(
            'To use Liveblocks client in a non-dom environment with a publicApiKey, you need to provide a fetch polyfill.'
          )
        }
        return fetchAuthEndpoint(fetcher, authentication.url, {
          room: roomId,
          publicApiKey: authentication.publicApiKey
        }).then(({ token }) => parseAuthToken(token))
      }
    } else if (authentication.type === 'private') {
      return async () => {
        if (fetcher === void 0) {
          throw new StopRetrying(
            'To use Liveblocks client in a non-dom environment with a url as auth endpoint, you need to provide a fetch polyfill.'
          )
        }
        return fetchAuthEndpoint(fetcher, authentication.url, {
          room: roomId
        }).then(({ token }) => parseAuthToken(token))
      }
    } else if (authentication.type === 'custom') {
      return async () => {
        const response = await authentication.callback(roomId)
        if (!response || typeof response !== 'object') {
          throw new Error(
            'We expect the authentication callback to return a token, but it does not. Hint: the return value should look like: { token: "..." }'
          )
        }
        if (typeof response.token === 'string') {
          return parseAuthToken(response.token)
        } else if (typeof response.error === 'string') {
          const reason = `Authentication failed: ${
            'reason' in response && typeof response.reason === 'string'
              ? response.reason
              : 'Forbidden'
          }`
          if (response.error === 'forbidden') {
            throw new StopRetrying(reason)
          } else {
            throw new Error(reason)
          }
        } else {
          throw new Error(
            'We expect the authentication callback to return a token, but it does not. Hint: the return value should look like: { token: "..." }'
          )
        }
      }
    } else {
      throw new Error('Internal error. Unexpected authentication type')
    }
  }
  async function fetchAuthEndpoint(fetch2, endpoint, body) {
    const res = await fetch2(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Credentials are needed to support authentication with cookies
      credentials: 'include',
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      const reason = `${
        (await res.text()).trim() || 'reason not provided in auth response'
      } (${res.status} returned by POST ${endpoint})`
      if (res.status === 401 || res.status === 403) {
        throw new StopRetrying(`Unauthorized: ${reason}`)
      } else {
        throw new Error(`Failed to authenticate: ${reason}`)
      }
    }
    let data
    try {
      data = await res.json()
    } catch (er) {
      throw new Error(
        `Expected a JSON response when doing a POST request on "${endpoint}". ${String(
          er
        )}`
      )
    }
    if (!isPlainObject(data) || typeof data.token !== 'string') {
      throw new Error(
        `Expected a JSON response of the form \`{ token: "..." }\` when doing a POST request on "${endpoint}", but got ${JSON.stringify(
          data
        )}`
      )
    }
    const { token } = data
    return { token }
  }
  var MIN_THROTTLE = 16
  var MAX_THROTTLE = 1e3
  var DEFAULT_THROTTLE = 100
  var MIN_LOST_CONNECTION_TIMEOUT = 200
  var RECOMMENDED_MIN_LOST_CONNECTION_TIMEOUT = 1e3
  var MAX_LOST_CONNECTION_TIMEOUT = 3e4
  var DEFAULT_LOST_CONNECTION_TIMEOUT = 5e3
  function getServerFromClientOptions(clientOptions) {
    const rawOptions = clientOptions
    return typeof rawOptions.liveblocksServer === 'string'
      ? rawOptions.liveblocksServer
      : 'wss://api.liveblocks.io/v6'
  }
  function createClient(options) {
    const clientOptions = options
    const throttleDelay = getThrottle(
      clientOptions.throttle ?? DEFAULT_THROTTLE
    )
    const lostConnectionTimeout = getLostConnectionTimeout(
      clientOptions.lostConnectionTimeout ?? DEFAULT_LOST_CONNECTION_TIMEOUT
    )
    const rooms = /* @__PURE__ */ new Map()
    function getRoom(roomId) {
      const room = rooms.get(roomId)
      return room ? room : null
    }
    function enter(roomId, options2) {
      const existingRoom = rooms.get(roomId)
      if (existingRoom !== void 0) {
        return existingRoom
      }
      deprecateIf(
        options2.initialPresence === null ||
          options2.initialPresence === void 0,
        'Please provide an initial presence value for the current user when entering the room.'
      )
      const newRoom = createRoom(
        {
          initialPresence: options2.initialPresence ?? {},
          initialStorage: options2.initialStorage
        },
        {
          roomId,
          throttleDelay,
          lostConnectionTimeout,
          polyfills: clientOptions.polyfills,
          delegates: clientOptions.mockedDelegates,
          enableDebugLogging: clientOptions.enableDebugLogging,
          unstable_batchedUpdates: options2?.unstable_batchedUpdates,
          liveblocksServer: getServerFromClientOptions(clientOptions),
          authentication: prepareAuthentication(clientOptions, roomId),
          httpSendEndpoint: buildLiveblocksHttpSendEndpoint(
            clientOptions,
            roomId
          ),
          unstable_fallbackToHTTP: !!clientOptions.unstable_fallbackToHTTP
        }
      )
      rooms.set(roomId, newRoom)
      setupDevTools(() => Array.from(rooms.keys()))
      linkDevTools(roomId, newRoom)
      const shouldConnect = options2.shouldInitiallyConnect ?? true
      if (shouldConnect) {
        if (typeof atob === 'undefined') {
          if (clientOptions.polyfills?.atob === void 0) {
            throw new Error(
              'You need to polyfill atob to use the client in your environment. Please follow the instructions at https://liveblocks.io/docs/errors/liveblocks-client/atob-polyfill'
            )
          }
          global.atob = clientOptions.polyfills.atob
        }
        newRoom.connect()
      }
      return newRoom
    }
    function leave(roomId) {
      unlinkDevTools(roomId)
      const room = rooms.get(roomId)
      if (room !== void 0) {
        room.destroy()
        rooms.delete(roomId)
      }
    }
    return {
      getRoom,
      enter,
      leave
    }
  }
  function checkBounds(option, value, min, max, recommendedMin) {
    if (typeof value !== 'number' || value < min || value > max) {
      throw new Error(
        `${option} should be a number between ${
          recommendedMin ?? min
        } and ${max}.`
      )
    }
    return value
  }
  function getThrottle(value) {
    return checkBounds('throttle', value, MIN_THROTTLE, MAX_THROTTLE)
  }
  function getLostConnectionTimeout(value) {
    return checkBounds(
      'lostConnectionTimeout',
      value,
      MIN_LOST_CONNECTION_TIMEOUT,
      MAX_LOST_CONNECTION_TIMEOUT,
      RECOMMENDED_MIN_LOST_CONNECTION_TIMEOUT
    )
  }
  function prepareAuthentication(clientOptions, roomId) {
    const { publicApiKey, authEndpoint } = clientOptions
    if (authEndpoint !== void 0 && publicApiKey !== void 0) {
      throw new Error(
        'You cannot use both publicApiKey and authEndpoint. Please use either publicApiKey or authEndpoint, but not both. For more information: https://liveblocks.io/docs/api-reference/liveblocks-client#createClient'
      )
    }
    if (typeof publicApiKey === 'string') {
      if (publicApiKey.startsWith('sk_')) {
        throw new Error(
          'Invalid publicApiKey. You are using the secret key which is not supported. Please use the public key instead. For more information: https://liveblocks.io/docs/api-reference/liveblocks-client#createClientPublicKey'
        )
      } else if (!publicApiKey.startsWith('pk_')) {
        throw new Error(
          'Invalid key. Please use the public key format: pk_<public key>. For more information: https://liveblocks.io/docs/api-reference/liveblocks-client#createClientPublicKey'
        )
      }
      return {
        type: 'public',
        publicApiKey,
        url: buildLiveblocksPublicAuthorizeEndpoint(clientOptions, roomId)
      }
    }
    if (typeof authEndpoint === 'string') {
      return {
        type: 'private',
        url: authEndpoint
      }
    } else if (typeof authEndpoint === 'function') {
      return {
        type: 'custom',
        callback: authEndpoint
      }
    } else if (authEndpoint !== void 0) {
      throw new Error(
        'authEndpoint must be a string or a function. For more information: https://liveblocks.io/docs/api-reference/liveblocks-client#createClientAuthEndpoint'
      )
    }
    throw new Error(
      'Invalid Liveblocks client options. For more information: https://liveblocks.io/docs/api-reference/liveblocks-client#createClient'
    )
  }
  function buildLiveblocksHttpSendEndpoint(options, roomId) {
    if (options.httpSendEndpoint) {
      return options.httpSendEndpoint.replace('{roomId}', roomId)
    }
    return `https://api.liveblocks.io/v2/rooms/${encodeURIComponent(
      roomId
    )}/send-message`
  }
  function buildLiveblocksPublicAuthorizeEndpoint(options, roomId) {
    if (options.publicAuthorizeEndpoint) {
      return options.publicAuthorizeEndpoint.replace('{roomId}', roomId)
    }
    return `https://api.liveblocks.io/v2/rooms/${encodeURIComponent(
      roomId
    )}/public/authorize`
  }
  detectDupes(PKG_NAME, PKG_VERSION, PKG_FORMAT)

  // node_modules/@liveblocks/client/dist/index.mjs
  var PKG_NAME2 = '@liveblocks/client'
  var PKG_VERSION2 = '1.1.8'
  var PKG_FORMAT2 = 'esm'
  detectDupes(PKG_NAME2, PKG_VERSION2, PKG_FORMAT2)

  // src/app.js
  function generateRandomId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    )
  }
  function removeStaleReactions() {
    window.reactions.remoteReactions = window.reactions.remoteReactions.filter(
      reaction => {
        const delta =
          (/* @__PURE__ */ new Date().getTime() - reaction.timestamp) / 1e3
        return delta < 2 + 2
      }
    )
  }
  var generateRandomCurveForReaction = () => {
    const randomX1 = `100%`
    const randomY1 = `100%`
    const randomX2 = `${Math.random() * 5}%`
    const randomY2 = `${Math.random() * 50 + 50}%`
    return `cubic-bezier(${randomX1}, ${randomY1}, ${randomX2}, ${randomY2})`
  }
  var getStartingAngleForReaction = () => {
    const direction = Math.random() < 0.5 ? 1 : -1
    const startingAngle = Math.floor(Math.random() * 90)
    return direction * startingAngle
  }
  var client = createClient({
    publicApiKey:
      'pk_prod_nQme4lxwwAyBuCvk2CQP0Tve9kBh1KxeN_FUdQQqrc24qH9qYA2anmqOToNCpFyA'
  })
  function run() {
    const room = client.enter('javascript-todo-app', {
      initialPresence: {}
    })
    window.reactions = {
      react: void 0,
      remoteReactions: [],
      getStartingAngleForReaction,
      generateRandomCurveForReaction
    }
    window.reactions.react = id => {
      let emoji = ''
      switch (id) {
        case 'heart':
          emoji = '\u2764\uFE0F'
          break
        case 'fire':
          emoji = '\u{1F525}'
          break
        case 'octopus':
          emoji = '\u{1F419}'
          break
        case 'rocket':
          emoji = '\u{1F680}'
          break
      }
      if (emoji !== '')
        room.broadcastEvent({ type: 'reaction', emoji, emojiId: id })
    }
    room.subscribe('event', ({ event }) => {
      removeStaleReactions()
      if (event.type === 'reaction') {
        window.reactions.remoteReactions.push({
          id: generateRandomId(),
          emojiId: event.emojiId,
          type: event.emoji,
          shown: false,
          timestamp: /* @__PURE__ */ new Date().getTime(),
          curve: generateRandomCurveForReaction(),
          startingAngle: getStartingAngleForReaction()
        })
      }
    })
  }
  run()
})()
