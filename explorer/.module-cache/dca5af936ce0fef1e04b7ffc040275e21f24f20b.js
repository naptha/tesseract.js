class Dora extends React.Component {
	
	constructor(props){
		super(props)
		this.state = {
			expanded: false
		}
	}

	render(){

		var {node} = this.props;
		var {expanded} = this.state;

		if(Array.isArray(node)){
			return node.map(x => React.createElement(Dora, {node: x}))
		}else if(typeof node == "number" || "boolean" || "string"){
			return React.createElement("span", null, JSON.stringify(node))
		}else{
			if(expanded){
				return Object.keys(node).map(key => {
					return React.createElement("div", null, React.createElement(Dora, {node: key}), ": ", React.createElement(Dora, {node: node[key]}), ",")
				})	
			}else{
				return React.createElement("span", {onClick: e => this.setState({expanded: true})}, "click me to expand")
			}
			
		}
	}
}


React.render(React.createElement(Dora, {node: window}), document.getElementById('explorer'))