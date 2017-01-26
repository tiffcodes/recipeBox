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
						return <RecipeCard 
							key={this.props.isGlobal ? `publicCard-${i}` : `privateCard-${i}`} 
							recipe={recipe} 
							allUsersRecipes={this.props.allUsersRecipes}
							alphabet={alphabet}
							checkAlphabet={this.checkAlphabet} 
							firstLetter={firstLetter} 
							currentUser={this.props.currentUser}
							isGlobal={this.props.isGlobal}
							/>
				})}
				</div>
		)

	};
}
