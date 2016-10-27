import React from 'react';
import ReactDom from 'react-dom';


export default class Footer extends React.Component {
	constructor() {
		super();
		this.state = {
		}
	}

	render() {
		return (
			<footer>
				<div className="leaf"></div>
				<p><a href="mailto:hello@tiffanydanielle.ca"><i className="fa fa-envelope"></i>email me</a></p>
				<p><a href="https://www.instagram.com/tiffnogueira/"><i className="fa fa-instagram"></i>follow me</a></p>
				<p><a href="https://twitter.com/tiffnogueira"><i className="fa fa-twitter"></i>tweet me</a></p>
				<p>coded and designed by <a href="tiffanydanielle.ca">tiff nogueira</a></p>
				<p className="smallFont">copyright 2016</p>
			</footer>
		);
	}
}