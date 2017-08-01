import React, {
  Component
} from 'react';
import classNames from 'classnames';
import PubSub from "pubsub";
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
import './App.less';
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const CollapsePanel = Collapse.Panel;
const TreeNode = Tree.TreeNode;

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  render(text) {
    return <a href="#">{text}</a>;
  }
}, {
  title: '年龄',
  dataIndex: 'age'
}, {
  title: '住址',
  dataIndex: 'address'
}];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `李大嘴${i}`,
    age: 32,
    address: `西湖区湖底公园${i}号`
  });
}

const pagination = {
  total: data.length,
  current: 1,
  showSizeChanger: true,
  onShowSizeChange(current, pageSize) {
    console.log('Current: ', current, '; PageSize: ', pageSize);
  },
  onChange(current) {
    console.log('Current: ', current);
  }
};

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({
      title: key,
      key
    });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

function generateTreeNodes(treeNode) {
  const arr = [];
  const key = treeNode.props.eventKey;
  for (let i = 0; i < 3; i++) {
    arr.push({
      name: `leaf ${key}-${i}`,
      key: `${key}-${i}`
    });
  }
  return arr;
}

function setLeaf(treeData, curKey, level) {
  const loopLeaf = (data, lev) => {
    const l = lev - 1;
    data.forEach((item) => {
      if ((item.key.length > curKey.length) ? item.key.indexOf(curKey) !== 0 :
        curKey.indexOf(item.key) !== 0) {
        return;
      }
      if (item.children) {
        loopLeaf(item.children, l);
      } else if (l < 1) {
        item.isLeaf = true;
      }
    });
  };
  loopLeaf(treeData, level + 1);
}

function getNewTreeData(treeData, curKey, child, level) {
  const loop = (data) => {
    if (level < 1 || curKey.length - 3 > level * 2) return;
    data.forEach((item) => {
      if (curKey.indexOf(item.key) === 0) {
        if (item.children) {
          loop(item.children);
        } else {
          item.children = child;
        }
      }
    });
  };
  loop(treeData);
  setLeaf(treeData, curKey, level);
}

const LMenu = React.createClass({
  getDefaultProps() {
    return {
      multiple: true,
      keys: ['0-0-0', '0-0-1'],
      gData,
      expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
    };
  },
  getInitialState() {
    const keys = this.props.keys;
    return {
      current: '1',
      openKeys: [],
      menus: [],
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      multiple: true,
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData: [],
    };
  },
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        treeData: [{
          name: 'pNode 01',
          key: '0-0'
        }, {
          name: 'pNode 02',
          key: '0-1'
        }, {
          name: 'pNode 03',
          key: '0-2',
          isLeaf: true
        }, ],
      });
    }, 100);
  },
  onLoadData(treeNode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const treeData = [...this.state.treeData];
        getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
        this.setState({
          treeData
        });
        resolve();
      }, 500);
    });
  },
  addPanel(e) {
    console.log('click ', e);
    this.setState({
      current: e.key,
      openKeys: e.keyPath.slice(1)
    });
    PubSub.publish('menuClick', {
      menuKey: e.key,
      menuText: e.item.props.children
    });
  },
  handleClick(e) {
    this.addPanel(e);
  },
  onToggle(info) {
    this.addPanel(info);
    this.setState({
      openKeys: info.open ? info.keyPath : info.keyPath.slice(1)
    });
  },
  getDefaultProps() {
    return {
      keys: ['0-0-0', '0-0-1'],
    };
  },
  onSelect(info) {
    console.log('selected', info);
  },
  onCheck(info) {
    console.log('onCheck', info);
  },
  onExpand(expandedKeys) {
    console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded chilren keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  },
  render() {
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.key} title={<span><Icon type="mail" /><span>导航一</span>{item.key}</span>} disableCheckbox={item.key === '0-0-0'}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.key} />;
    });
    const treeNodes = loop(this.state.treeData);
    return (
      <Collapse>
        <CollapsePanel header={"menu1"} key="m1">
          <Menu onClick={this.handleClick}
                openKeys={this.state.openKeys}
                onOpen={this.onToggle}
                onClose={this.onToggle}
                selectedKeys={[this.state.current]}
                mode="inline">
            <MenuItem key="0">选项0</MenuItem>
            <SubMenu key="sub1" title={<span><Icon type="mail" /><span>导航一</span></span>}>
              <MenuItem key="1">选项1</MenuItem>
              <MenuItem key="2">选项2</MenuItem>
              <MenuItem key="3">选项3</MenuItem>
              <MenuItem key="4">选项4</MenuItem>
              <SubMenu key="sub2" title={<span><Icon type="mail" /><span>导航一</span></span>}>
                <MenuItem key="5">选项1</MenuItem>
                <MenuItem key="6">选项2</MenuItem>
                <MenuItem key="7">选项3</MenuItem>
                <MenuItem key="8">选项4</MenuItem>
              </SubMenu>
            </SubMenu>
          </Menu>
        </CollapsePanel>
        <CollapsePanel header={"menu2"} key="m2">
          <Tree className="myCls" showLine multiple checkable
            defaultExpandedKeys={this.state.defaultExpandedKeys}
            defaultSelectedKeys={this.state.defaultSelectedKeys}
            defaultCheckedKeys={this.state.defaultCheckedKeys}
            onSelect={this.onSelect} onCheck={this.onCheck}>
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="parent 1-0" key="0-0-0" disabled>
                <TreeNode title="leafasdasdasdsaasdas撒到青春期的期望期望的" key="0-0-0-0" disableCheckbox />
                <TreeNode title="leaf" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 1-1" key="0-0-1">
                <TreeNode title={<span style={{ color: '#08c' }}>sss</span>} key="0-0-1-0" />
              </TreeNode>
            </TreeNode>
          </Tree>
        </CollapsePanel>
        <CollapsePanel header={"menu3"} key="m3">
          <Tree checkable multiple={this.props.multiple}
            onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}>
            {loop(gData)}
          </Tree>
        </CollapsePanel>
        <CollapsePanel header={"menu4"} key="m4">
          <Tree onSelect={this.onSelect} loadData={this.onLoadData}>
            {treeNodes}
          </Tree>
        </CollapsePanel>
      </Collapse>
    );
  }
});

const DropMenu = React.createClass({
  handleClick(e) {
    let key = e.key;
    PubSub.publish("closePanel", {
      key: key
    });
  },
  render() {
    return (<Menu onClick={this.handleClick}>
      <MenuItem key="1">关闭其他</MenuItem>
      <MenuItem key="2">关闭所有</MenuItem>
    </Menu>);
  }
})

const menus = <DropMenu />;

const DropdownMenu = React.createClass({
  closeOther() {
    PubSub.publish("closePanel", {
      key: 1
    });
  },
  closeAll(){
    PubSub.publish("closePanel", {
      key: 2
    });
  },
  render() {
    return (
    <div>
      <Button type="dashed" onClick={this.closeOther}>关闭其他</Button>
      <Button type="dashed" onClick={this.closeAll}>关闭所有</Button>
      <Popover content={menus} title="操作">
        <Button type="dashed">更多操作</Button>
      </Popover>
    </div>
    );
  }
});

function noop() {
  return false;
}

let Demo = React.createClass({
  getInitialState() {
    return {
      passBarShow: false, // 是否显示密码强度提示条
      rePassBarShow: false,
      passStrength: 'L', // 密码强度
      rePassStrength: 'L',
      visible: false,
    };
  },

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log('Submit!!!');
      console.log(values);
      this.setState({
        visible: false
      });
    });
  },

  getPassStrenth(value, type) {
    if (value) {
      let strength;
      // 密码强度的校验规则自定义，这里只是做个简单的示例
      if (value.length < 6) {
        strength = 'L';
      } else if (value.length <= 9) {
        strength = 'M';
      } else {
        strength = 'H';
      }
      if (type === 'pass') {
        this.setState({
          passBarShow: true,
          passStrength: strength
        });
      } else {
        this.setState({
          rePassBarShow: true,
          rePassStrength: strength
        });
      }
    } else {
      if (type === 'pass') {
        this.setState({
          passBarShow: false
        });
      } else {
        this.setState({
          rePassBarShow: false
        });
      }
    }
  },

  showModal() {
    this.props.form.resetFields();
    this.setState({
      visible: true,
      passBarShow: false,
      rePassBarShow: false
    });
  },

  hideModal() {
    this.setState({
      visible: false
    });
  },

  checkPass(rule, value, callback) {
    const form = this.props.form;
    this.getPassStrenth(value, 'pass');

    if (form.getFieldValue('pass')) {
      form.validateFields(['rePass'], {
        force: true
      });
    }

    callback();
  },

  checkPass2(rule, value, callback) {
    const form = this.props.form;
    this.getPassStrenth(value, 'rePass');

    if (value && value !== form.getFieldValue('pass')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  },

  renderPassStrengthBar(type) {
    const strength = type === 'pass' ? this.state.passStrength : this.state.rePassStrength;
    const classSet = classNames({
      'ant-pwd-strength': true,
      'ant-pwd-strength-low': strength === 'L',
      'ant-pwd-strength-medium': strength === 'M',
      'ant-pwd-strength-high': strength === 'H'
    });
    const level = {
      L: '低',
      M: '中',
      H: '高'
    };

    return (
      <div>
        <ul className={classSet}>
          <li className="ant-pwd-strength-item ant-pwd-strength-item-1"></li>
          <li className="ant-pwd-strength-item ant-pwd-strength-item-2"></li>
          <li className="ant-pwd-strength-item ant-pwd-strength-item-3"></li>
          <span className="ant-form-text">
            {level[strength]}
          </span>
        </ul>
      </div>
    );
  },

  render() {
    const {
      getFieldProps
    } = this.props.form;

    // 如果觉得在 JSX 中写 `getFieldProps` 会影响阅读，可以先用变量保存 `getFieldProps` 的返回值。
    const passProps = getFieldProps('pass', {
      rules: [{
        required: true,
        whitespace: true,
        message: '请填写密码'
      }, {
        validator: this.checkPass
      }]
    });
    const rePassProps = getFieldProps('rePass', {
      rules: [{
        required: true,
        whitespace: true,
        message: '请再次输入密码',
      }, {
        validator: this.checkPass2,
      }],
    });
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      },
    };
    return (
      <div>
        <Button type="dashed" onClick={this.showModal} className="btn-editPsd">修改密码</Button>
        <Modal title="修改密码" visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.hideModal}>
          <Form horizontal form={this.props.form}>
            <Row>
              <Col span="18">
                <FormItem
                  {...formItemLayout}
                  label="密码：">
                  <Input {...passProps} type="password"
                                        onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                        autoComplete="off" id="pass"/>
                </FormItem>
              </Col>
              <Col span="6">
                {this.state.passBarShow ? this.renderPassStrengthBar('pass') : null}
              </Col>
            </Row>

            <Row>
              <Col span="18">
                <FormItem
                  {...formItemLayout}
                  label="确认密码：">
                  <Input {...rePassProps} type="password"
                                          onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                          autoComplete="off" id="rePass"/>
                </FormItem>
              </Col>
              <Col span="6">
                {this.state.rePassBarShow ? this.renderPassStrengthBar('rePass') : null}
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
});

Demo = Form.create()(Demo);

const operations = <div style={{"margin":"0px 10px","display":"inline-block"}}>
  <DropdownMenu />
</div>;

const CusTabs = React.createClass({
  getInitialState() {
    this.newTabIndex = 0;
    const panes = [
      <TabPane tab="选项卡" key="1">
        <Table columns={columns} dataSource={data} pagination={pagination}/>
        <Table columns={columns} dataSource={data} pagination={pagination} useFixedHeader/>
        <Table columns={columns} dataSource={data} pagination={pagination} useFixedHeader/>
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} useFixedHeader/>
      </TabPane>,
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
    this.pubsub_token = PubSub.subscribe('menuClick', function(topic, data) {
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
    }.bind(this));
  },
  componentWillUnmount: function() {
    PubSub.unsubscribe(this.pubsub_token);
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

class App extends Component {
  render() {
    return <div className="content-body">
      <div className="content-top">
        <h1>Im a top title!</h1>
        <Demo style={{"float":"right"}}/>
      </div>
      <Row className="content-center">
        <Col className="content-fh content-menu" xs={6} sm={6} md={6} lg={4}>
          <LMenu />
        </Col>
        <Col className="content-fh content-main" xs={18} sm={18} md={18} lg={20}>
          <CusTabs />
        </Col>
      </Row>
    </div>;
  }
}

export default App;