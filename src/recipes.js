import React from 'react';
import ReactDom from 'react-dom';
import Alphabet from './alphabet.js';

export default class Recipes extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			recipe: []
		}
	}

	// dont use state
	componentDidMount() {
		firebase.database().ref('recipe').on('value', (res) => {
			const data = res.val();
			const recipe = [];
			for(let key in data) {
				data[key].key = key;
				recipe.push(data[key]);
			}
			this.setState({recipe});
		});
	}

	removeRecipe(recipeToRemove) {
		recipeToRemove.key
		firebase.database().ref(`recipe/${recipeToRemove.key}`).remove();
	}

	checkAlphabet(letter, alphabet) {
		// for each recipe, check to see if the first letter in the title is in the alphabet state
		if (alphabet.includes(letter)) {
			let indexOfLetter = alphabet.indexOf(letter);
			// if it is then add the id and splice out the char in the page 
			alphabet.splice(indexOfLetter, 1);
			return letter;
		} 
		else {
			return '';
		}
	}

	render() {
		const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
		return (
			<section>
				<h3>Recipes:</h3>
				<Alphabet />
				{
					this.state.recipe.sort(function(a, b){
						let titleA = a.title.toLowerCase();
						let titleB = b.title.toLowerCase();
					    if(titleA < titleB) return -1;
					    if(titleA > titleB) return 1;
					    return 0;
					}).map((recipe, i) => {
						// grab first letter of title:
						let firstLetter = recipe.title.charAt(0).toLowerCase();
						
						return (
							<div key={i} className="recipe" id={this.checkAlphabet(firstLetter, alphabet)} >
								<i className="fa fa-times" onClick={(e) => this.removeRecipe.call(this, recipe)}></i>
								<h2>{recipe.title}</h2>
								<p>Prep Time: {recipe.prepTime}</p>
								<p>Total Time: {recipe.totalTime}</p>
								<p>Ingredients:</p>
								<ul>

									{ (() => {
										if(recipe.ingredients !== "") {
											return recipe.ingredients.map((recipeIngred, i) => {
													return (
														<li key={i}>{recipeIngred}</li>
													)
												});
											}

										})()
									}
								</ul>
								<p>Instructions:</p>
								<ul>
									{ (() => {
										if(recipe.instructions !== "") {
											return recipe.instructions.map((recipeInstruction, i) => {
													return (
														<li key={i}>{recipeInstruction}</li>
													)
												});
											}

										})()
									}
								</ul>
								<p>Serves: {recipe.serves}</p>
							</div>
						)
				})}
			</section>
		)

	};
}
