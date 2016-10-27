import React from 'react';
import ReactDom from 'react-dom';


export default class Header extends React.Component {
	constructor() {
		super();
		this.state = {
		}
	}

	render() {
		return (
			<header>
				<h1>Recipe Box</h1>
			</header>
		);
	}
}