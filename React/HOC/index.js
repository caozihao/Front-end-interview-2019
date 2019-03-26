funciton proxyHoc(Comp){
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

// 使用姿势如下，这样就能非常快速的将一个 Input 组件转化成受控组件
const nameInput = props => (<input name="name" {...props} />)
export default withOnChange(NameInput)