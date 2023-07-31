import { createClient } from "@liveblocks/client";

const client = createClient({
  publicApiKey: "pk_prod_nQme4lxwwAyBuCvk2CQP0Tve9kBh1KxeN_FUdQQqrc24qH9qYA2anmqOToNCpFyA",
});

function run() {
    const room = client.enter("javascript-todo-app", {
      initialPresence: { isTyping: false },
    });

    const whoIsHere = document.getElementById("who_is_here");

    room.subscribe("others", (others) => {
      whoIsHere.innerHTML = `There are ${others.count} other users online`;
    });
}
  
run();
  