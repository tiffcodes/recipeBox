import React from 'react';
import RecipeCard from './recipeCard';

export default class Recipes extends React.Component {

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
				<div>
				{
					this.props.recipe.sort(function(a, b){
						let titleA = a.title.toLowerCase();
						let titleB = b.title.toLowerCase();
					    if(titleA < titleB) return -1;
					    if(titleA > titleB) return 1;
					    return 0;
					}).map((recipe, i) => {
						// grab first letter of title:
						let firstLetter = recipe.title.charAt(0).toLowerCase();
						return <RecipeCard key={`card-${i}`} 
							recipe={recipe} 
							alphabet={alphabet}
							checkAlphabet={this.checkAlphabet} 
							firstLetter={firstLetter} 
							removeRecipe={this.props.removeRecipe}/>
				})}
				</div>
		)

	};
}

// map in the app component, and have the recipe be just the individ recipe which can work off of props 
