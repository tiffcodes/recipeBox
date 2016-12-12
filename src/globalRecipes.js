import React from 'react';
import Recipes from './recipes';
import Alphabet from './alphabet';

export default class GlobalRecipes extends React.Component {
	// constructor(props, context) {
	// 	super();
	// 	this.state = {
	// 	}
	// }

	constructor(props, context) {
		super();
		let config = {
			apiKey: "AIzaSyBvMwXsV0jsyGOy2laI6mUPdSo4irwT9hI",
			authDomain: "my-project-734e0.firebaseapp.com",
			databaseURL: "https://my-project-734e0.firebaseio.com",
			storageBucket: "my-project-734e0.appspot.com",
			messagingSenderId: "712734743751"
		};
		firebase.initializeApp(config);
		let currentUser = '';
	}	

	componentDidMount() {
		firebase.database().ref('recipe').on('value', (res) => {
			const data = res.val();
			const allRecipes = [];
			for(let key in data) {
				data[key].key = key;
				allRecipes.push(data[key]);
			}
			return this.renderRecipes(allRecipes);
		});
	}

	renderRecipes(recipes) {
		return (
			<div>
				<Alphabet />
				<Recipes recipe={recipes} currentUser={this.currentUser} />
			</div>
		)
	}

	render() {
		return (
			<div>
				<h3>All Recipes:</h3>

			</div>
		)
	};
}