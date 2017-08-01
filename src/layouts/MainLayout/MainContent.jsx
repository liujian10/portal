import React, {
	Component
} from 'react';
import {
  DatePicker,
  Menu,
  Icon,
  Row,
  Col,
  Carousel,
  Table,
  Tabs,
  Affix,
  Button,
  Dropdown,
  Form,
  Input,
  Checkbox,
  Modal,
  Collapse,
  Tree,
  Popover
} from 'antd';
import styles from './MainLayout.less';
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const CollapsePanel = Collapse.Panel;
const TreeNode = Tree.TreeNode;

const operations = <div style={{"margin":"0px 10px","display":"inline-block"}}>
</div>;

const CusTabs = React.createClass({
  getInitialState() {
    this.newTabIndex = 0;
    const panes = [
      <TabPane tab="选项卡" key="1">123</TabPane>,
      <TabPane tab="选项卡2" key="2"></TabPane>,
      <TabPane tab="选项卡3" key="3"></TabPane>,
      <TabPane tab="选项卡4" key="4"></TabPane>,
      <TabPane tab="选项卡5" key="5"></TabPane>,
      <TabPane tab="选项卡6" key="6"></TabPane>,
      <TabPane tab="选项卡7" key="7"></TabPane>,
      <TabPane tab="选项卡8" key="8"></TabPane>,
      <TabPane tab="选项卡9" key="9"></TabPane>,
    ];
    return {
      activeKey: panes[0].key,
      panes,
    };
  },
  onChange(activeKey) {
    this.setState({
      activeKey
    });
  },
  onEdit(targetKey, action) {
    this[action](targetKey);
  },
  add() {
    const panes = this.state.panes;
    const activeKey = this.state.tabKey == undefined || null ? `tab-${this.newTabIndex++}` : this.state.tabKey;
    var flag = false;
    for (var i = 0; i < panes.length; i++) {
      if (panes[i].key == activeKey) {
        flag = true;
      }
    }
    if (!flag) {
      const tabText = this.state.tabText == undefined || null ? "新建页签" : this.state.tabText;
      panes.push(<TabPane tab={tabText} key={activeKey}>新页面</TabPane>);
    }
    this.setState({
      panes,
      activeKey,
      tabKey: null,
      tabText: null
    });
  },
  remove(targetKey) {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({
      panes,
      activeKey
    });
  },
  componentDidMount: function() {
    /*this.pubsub_token = PubSub.subscribe('menuClick', function(topic, data) {
      this.setState({
        tabText: data.menuText,
        tabKey: data.menuKey
      });
      this.add();
    }.bind(this));
    this.pubsub_token = PubSub.subscribe('closePanel', function(topic, data) {
      let activeKey = this.state.activeKey;
      let ps = this.state.panes;
      let key = data.key;
      const panes = [];
      var flag = false;
      if (key == 0) {
        this.remove(activeKey);
        return;
      } else if (key == 1) {
        for (var i = 0; i < ps.length; i++) {
          if (ps[i].key == activeKey) {
            panes.push(ps[i]);
          }
        }
      }
      this.setState({
        panes
      });
    }.bind(this));*/
  },
  componentWillUnmount: function() {
    /*PubSub.unsubscribe(this.pubsub_token);*/
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value
      });
    }
  },
  render() {
    return (
      <Tabs onChange={this.onChange} activeKey={this.state.activeKey}
            type="editable-card" onEdit={this.onEdit} tabBarExtraContent={operations}>
        {this.state.panes}
      </Tabs>
    );
  }
});

class MainContent extends Component {
	constructor() {
		super();
		this.state = {};
	}
	componentWillMount() {}
	render() {
		return (
			<CusTabs/>
		)
	}
};

export default MainContent;