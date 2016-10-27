import React from 'react';
import ReactDom from 'react-dom';
import Footer from './footer.js';
import Header from './header.js';

export default class AddRecipe extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			recipe: []
		}
	}
	componentDidMount() {
		firebase.database().ref('recipe').on('value', (res) => {
			console.log(res.val());
			const data = res.val();
			const recipe = [];
			for(let key in data) {
				data[key].key = key;
				recipe.push(data[key]);
			}
			this.setState({recipe}); 
		});
	}
	createNewRecipe(e) {
		e.preventDefault();
		console.log('created');
		// save input values
		const recipeTitle = this.recipeTitle.value;
		const recipePrepTime = this.recipePrepTime.value;
		const recipeTotalTime = this.recipeTotalTime.value;
		const recipeIngredients = this.recipeIngredients.value;
		const recipeInstructions = this.recipeInstructions.value;
		const recipeServes = this.recipeServes.value;
		
		// add to recipe object:
		const recipe = {
			title: recipeTitle,
			prepTime: recipePrepTime,
			totalTime: recipeTotalTime,
			ingredients: recipeIngredients,
			instructions: recipeInstructions,
			serves: recipeServes
		};
		console.log(recipe);
		firebase.database().ref('recipe').push(recipe);
		// Save to firebase:


		// clear the inputs
		this.recipeTitle.value = '';
		this.recipePrepTime.value = '';
		this.recipeTotalTime.value = '';
		this.recipeIngredients.value = '';
		this.recipeInstructions.value = '';
		this.recipeServes.value = '';
	}
	removeRecipe(recipeToRemove) {
		recipeToRemove.key 
		firebase.database().ref(`recipe/${recipeToRemove.key}`).remove();
	}
	render() {
		return (
			<section>
				<form action="" onSubmit={(e) => this.createNewRecipe.call(this,e) } className="addRecipe">
					<div className="flower">
						<img src="src/assets/bud.svg" href="Water colour small pink bud"/>
					</div>
					<h2>Add a New Recipe:</h2>
					<div>
						<label>Enter your recipe title:</label>
						<input type="text" ref={ref => this.recipeTitle = ref}/>

						<label>Enter the prep time:</label>
						<input type="text" ref={ref => this.recipePrepTime = ref}/>

						<label>Enter the total time:</label>
						<input type="text" ref={ref => this.recipeTotalTime = ref}/>

						<label>Enter the ingredients:</label>
						<input type="text" ref={ref => this.recipeIngredients = ref}/>

						<label>Enter the instructions:</label>
						<input type="text" ref={ref => this.recipeInstructions = ref}/>

						<label>Serves:</label>
						<input type="text" ref={ref => this.recipeServes = ref}/>

						<input type="submit" />
					</div>
				</form>
				<section>
					<h3>Recipes:</h3>
					{this.state.recipe.map((recipe, i) => {
						return(
							<div key={i} className="recipe">
								<i className="fa fa-times" onClick={(e) => this.removeRecipe.call(this, recipe)}></i>
								<h2>{recipe.title}</h2>
								<p>{recipe.prepTime}</p>
								<p>{recipe.totalTime}</p>
								<p>{recipe.ingredients}</p>
								<p>{recipe.instructions}</p>
								<p>{recipe.serves}</p>
							</div>
						)
					})}
				</section>
			</section>
		);
	};
}