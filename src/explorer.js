function array_join(array, glue){
    var new_array = []
    for(var i = 0; i < array.length; i++){
        new_array.push(array[i])
        if(i != array.length - 1) new_array.push(glue);
    }
    return new_array
}


class Node extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			expanded: props.expanded
		}
	}

	toggleExpand = e => {
		this.setState({expanded: !this.state.expanded})
	}

	render(){
		var {node, label} = this.props
		var {expanded} = this.state

		var rep
		if(typeof node === "string"){
			rep = <TextNode html={label === "html"} node={node} className="clickable" onClick={this.toggleExpand} toggleExpand={this.toggleExpand} expanded={expanded}/>
		}
		else if(typeof node === "boolean"){
			rep = <BooleanNode node={node} className="clickable" onClick={this.toggleExpand} toggleExpand={this.toggleExpand} expanded={expanded}/>
		}
		else if(typeof node === "number"){
			rep = <NumberNode node={node} className="clickable" onClick={this.toggleExpand} toggleExpand={this.toggleExpand} expanded={expanded}/>
		}
		else if(Array.isArray(node)){
			rep = <ListNode node={node} className="clickable" onClick={this.toggleExpand} toggleExpand={this.toggleExpand} expanded={expanded}/>
		}
		else {
			rep = <ObjectNode node={node} className="clickable" onClick={this.toggleExpand} toggleExpand={this.toggleExpand} expanded={expanded}/>
		}			
	
		if(!label){
			return rep
		}
		
		return <span><span className="label clickable" onClick={this.toggleExpand}>{label}</span>: {rep}</span>

	}
}

class TextNode extends React.Component {
	render(){
		var {node, expanded, html, toggleExpand} = this.props
		if(expanded){
			var content = node
			if (html) {
				var content = []
				CodeMirror.runMode(node, {name: 'xml', htmlMode: true}, (text, className) => {
					content.push(<span className={"cm-"+className}>{text}</span>)
				})
			}
			return <span className={(html ? "cm-s-default html ":"") + "textNode expanded clickable"} onClick={toggleExpand} >{content}</span>
		}
		else{
			return <span>
				<span className={(html? "html " : "")+"textNode clickable"} onClick={toggleExpand} >{node.substring(0,30)}</span>
				{node.length > 30 ? <Ellipsis /> : ''}
			</span>
		}
	}
}

class BooleanNode extends React.Component {
	render(){
		var {node} = this.props
		return <span className="booleanNode">{JSON.stringify(node)}</span>
	}
}

class NumberNode extends React.Component {
	render(){
		var {node} = this.props
		return <span className="numberNode">{JSON.stringify(node)}</span>
	}
}

class ListNode extends React.Component {
	render(){
		var {node, expanded, toggleExpand} = this.props
		if(expanded){
			return <span className="listNode expanded">
				<span className="clickable" onClick={toggleExpand}>[</span>
				<br />
				<span className="indent">
				{array_join(node.map((e, i) => 
					<Node node={e} key={i}/>
				),<Comma br/>)}
				
				</span>
				<br />
				<span onClick={toggleExpand}>]</span>
			</span>
		}
		else{
			return <span className="listNode clickable" onClick={toggleExpand}>[{node.length}]</span>
		}
	}
}

class ObjectNode extends React.Component {
	render(){
		var {node, expanded, toggleExpand} = this.props

		if(null === node){
			return <span className="nullNode">null</span>
		}
		else if(expanded){
			return <span className="objectNode expanded">
				<span className="clickable" onClick={toggleExpand}>{"{"}</span> 
				<br />
				<span className="indent">
				{array_join(Object.keys(node).map(
					key => <Node node={node[key]} label={key} key={key}/>
				),<Comma br/>)}
				</span>
				<br />
				<span onClick={toggleExpand}>{"}"}</span>
			</span>
		}
		else{
			var keys = Object.keys(node), toolong = false
			if (keys.length > 4) {
				keys = keys.slice(0,4)
				toolong = true
			}
			var contents = array_join(keys.map(k => <span className="label">{k}</span>), <Comma />)
			return <span className="objectNode clickable" onClick={toggleExpand} >{"{"}{contents}{toolong?<Ellipsis /> : ''}{"}"}</span>
		}
	}
}

class Comma extends React.Component {
	render(){
		var {br} = this.props
		return <span className="comma">, {br?<br />:''}</span>
	}
}

class Ellipsis extends React.Component {
	render(){
		return <span className="ellipsis">...</span>
	}
}

var simplething = {
	hello: 42,
	derp: 324,
	wumbo: [
		1,
		2,
		3,
		4,
		"hello", 
		{
			blah: 32,
			asdf: [],
			walp: 32,
			strings: "asdfsd",
		}
	],
	merp: {
		blah: 32,
		asdf: [],
		walp: 32,
		strings: "asdfsd",
	},
	strings: "asdfsd",
	asdoijfo: {
		strings: "asdfsd",
		adfds: {
			asdf: {
				asdfadsf: {},
				merp: 32
			}
		}
	}
}

// React.render(<Node node={simplething} />, document.getElementById('explorer'))