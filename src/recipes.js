import React from 'react';
import ReactDom from 'react-dom';

export default class Recipes extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			recipe: []
		}
	}

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

	render() {
		return (
			<section>
				<h3>Recipes:</h3>
				{
					this.state.recipe.map((recipe, i) => {
						return (
							<div key={i} className="recipe">
								<i className="fa fa-times" onClick={(e) => this.removeRecipe.call(this, recipe)}></i>
								<h2>{recipe.title}</h2>
								<p>{recipe.prepTime}</p>
								<p>{recipe.totalTime}</p>
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
								<p>{recipe.serves}</p>
							</div>
						)

				})}
			</section>
		)
	};
}
