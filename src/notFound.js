import React from 'react';
import { Link } from 'react-router';

export default function() {
	return (
		<div className="notFound">
			<h1>Hmm not quite sure what you're looking for.</h1>
			<p>I would suggest <Link to="/">checking out our home page</Link></p>
		</div>
	);
}
