import React from 'react';

export default function(props) {
	return (
		<div className="recipe" id={props.checkAlphabet(props.firstLetter, props.alphabet)} >
			<i className="fa fa-times" onClick={(e) => props.removeRecipe.call(this, props.recipe)}></i>
			<h2 id={props.recipe.title}>{props.recipe.title}</h2>
			<p>Prep Time: {props.recipe.prepTime}</p>
			<p>Total Time: {props.recipe.totalTime}</p>
			<p>Ingredients:</p>
			<ul>

				{ (() => {
					if(props.recipe.ingredients !== "") {
						return props.recipe.ingredients.map((recipeIngred, i) => {
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
					if(props.recipe.instructions !== "") {
						return props.recipe.instructions.map((recipeInstruction, i) => {
								return (
									<li key={i}>{recipeInstruction}</li>
								)
							});
						}

					})()
				}
			</ul>
			<p>Serves: {props.recipe.serves}</p>
		</div>
	)
};