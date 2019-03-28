// 默认参数，可以为组件包裹一层默认参数
function proxyHoc(Comp) {
  return class extends React.Component {
    render() {
      const newProps = {
        name: 'tayde',
        age: 1,
      }
      return <Comp {...this.props} {...newProps} />
    }
  }
}

// 提取状态: 可以通过 props 将被包裹组件中的 state 依赖外层，例如用于转换受控组件:
function withOnChange(Comp) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        name: '',
      }
    }
    onChangeName = () => {
      this.setState({
        name: 'dongdong',
      })
    }
    render() {
      const newProps = {
        value: this.state.name,
        onChange: this.onChangeName,
      }
      return <Comp {...this.props} {...newProps} />
    }
  }
}


const NameInput = props => (<input name="name" {...props} />)
export default withOnChange(NameInput)

// 包裹组件: 可以为被包裹元素进行一层包装，
function withMask(Comp) {
  return class extends React.Component {
    render() {
      return (
        <div>
          <Comp {...this.props} />
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, .6)'
          }}>
          </div>
        </div>
      )
    }
  }
}

// 反向继承 返回出一个组件，继承于被包裹组件，常用于以下操作:
function IHoc(Comp) {
  return class extends Comp {
    render() {
      return super.render()
    }
  }
}

// 渲染劫持

// 条件渲染:根据条件，渲染不同的组件

function withLoading(Comp) {
  return class extends Comp {
    render() {
      if (this.props.loading) {
        return <Loading />
      } else {
        return super.render()
      }
    }
  }
}

// 权限控制

function withAdminAuth(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        isAdmin: false,
      }
    }
    async componentWillMount() {
      const currentRole = await getCurrentUserRole();
      this.setState({
        isAdmin: currentRole === 'Admin',
      });
    }
    render() {
      if (this.state.isAdmin) {
        return <Comp {...this.props} />;
      } else {
        return (<div>您没有权限查看该页面，请联系管理员！</div>);
      }
    }
  };
}
