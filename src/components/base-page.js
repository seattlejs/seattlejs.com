import { h, Component } from "preact";
import { canUseDOM } from "exenv";
import classnames from "classnames";

class BasePage extends Component {
  componentDidMount() {
    if(canUseDOM) {
      window.scrollTo(0,0);
    }
  }

  render () {
    return (
      <div className={classnames(this.props.className, "BasePage")}>
        {this.props.children}
      </div>
    );
  }
}

export default BasePage;
