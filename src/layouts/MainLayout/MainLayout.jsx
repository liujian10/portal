import React, {
  Component,
  PropTypes
} from 'react';
import {
  Router,
  Route,
  IndexRoute,
  Link
} from 'react-router';
import {
  Card
} from "antd";
import styles from './MainLayout.less';
import MainHead from './MainHead';
import MainMenu from './MainMenu';
import MainContent from './MainContent';

class MainLayout extends Component {
  constructor() {
    super();
    var clientHeight = document.documentElement.clientHeight - 110
    this.state = {
      cardStyle: {
        padding: 0,
        height: clientHeight + "px"
      }
    };
    console.log("init" + this.state.cardStyle);
  }
  componentWillMount() {
    document.addEventListener('DOMContentLoaded', function() {
      var clientHeight = document.documentElement.clientHeight - 110
      this.state = {
        cardStyle: {
          padding: 0,
          height: clientHeight + "px"
        }
      }
      console.log("DOMContentLoaded" + this.state.cardStyle);
    });

    window.addEventListener('load', function() {
      var clientHeight = document.documentElement.clientHeight - 110
      this.state = {
        cardStyle: {
          padding: 0,
          height: clientHeight + "px"
        }
      }
      console.log("load" + this.state.cardStyle);
    });

    window.addEventListener('resize', function() {
      var clientHeight = document.documentElement.clientHeight - 110
      this.state = {
        cardStyle: {
          padding: 0,
          height: clientHeight + "px"
        }
      }
      console.log("resize" + this.state.cardStyle);
    });
  }
  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.head}  style={{height:"100px"}}>
          <MainHead></MainHead>
        </div>
        <Card className={styles.content} bodyStyle={this.state.cardStyle}>
            <MainMenu className={styles.side}></MainMenu>
            <div className={styles.main}>
              {this.state.cardStyle.height}
              <MainContent></MainContent>
            </div>
        </Card>
      </div>
    )
  }
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;