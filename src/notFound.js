import React from 'react';
import ReactDom from 'react-dom';


export default class NotFound extends React.Component {
	render() {
		return (
			<div className="notFound">
				<h1>Hmm not quite sure what you're looking for.</h1>
				<p>I would suggest <a href="/">checking out our home page</a></p>
			</div>
		);
	}
}
