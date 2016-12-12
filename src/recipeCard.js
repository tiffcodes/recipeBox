import React from 'react';

export default class RecipeCard extends React.Component {
	
	removeRecipe(recipeToRemove) {
		firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToRemove.key}`).remove();
	}

	render() {
		return (
			<div className="recipe" id={this.props.checkAlphabet(this.props.firstLetter, this.props.alphabet)} >
				<i className="fa fa-times" onClick={(e) => this.removeRecipe.call(this, this.props.recipe)}></i>
				<h2 id={this.props.recipe.title}>{this.props.recipe.title}</h2>
				<p>Prep Time: {this.props.recipe.prepTime}</p>
				<p>Total Time: {this.props.recipe.totalTime}</p>
				<p>Ingredients:</p>
				<ul>

					{ (() => {
						if(this.props.recipe.ingredients !== "") {
							return this.props.recipe.ingredients.map((recipeIngred, i) => {
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
						if(this.props.recipe.instructions !== "") {
							return this.props.recipe.instructions.map((recipeInstruction, i) => {
									return (
										<li key={i}>{recipeInstruction}</li>
									)
								});
							}

						})()
					}
				</ul>
				<p>Serves: {this.props.recipe.serves}</p>
			</div>
		)
	};
};