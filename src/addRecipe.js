import React from 'react';
import ReactDom from 'react-dom';

export default class AddRecipe extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			ingredients: [],
			instructions: [],
			listFocus: false, 
			titleError: false, 
			ingredientError: false,
			instructionError: false
		}
	}

	listFocus() {
		this.setState({
			listFocus: true
		});
	}

	listUnFocus() {
		this.setState({
			listFocus: false
		});
	}

	addIngredient(e) {
		e.preventDefault();
		let newIngredient = this.recipeIngredients.value;
		if (newIngredient.length > 0 && newIngredient != " ") {
			// make a new instance of the previous ingredient list from state
			let ingredientArray = Array.from(this.state.ingredients);
			// add new ingredient to that list
			ingredientArray.push(newIngredient);
			// reset the state with the new ingredient included on the list
			this.setState({
				ingredients: ingredientArray
			});
		}
		// resent the value of input to be blank and ready for next ingredient 
		this.recipeIngredients.value= '';
	}

	createIngredient(e) {
		if (e.keyCode === 13) {
			this.addIngredient(e);
		}
		
	}

	removeIngredient(ingredientToRemove){
		// get the index of the ingredient to remove
		let indexOfIngred = this.state.ingredients.indexOf(ingredientToRemove);
		// make a new instance of the ingredientsArray from state
		let ingredientsArray = Array.from(this.state.ingredients);
		ingredientsArray.splice(indexOfIngred, 1);
		// reset state to the new ingredientsArray without the removed ingredient
		this.setState({
			ingredients: ingredientsArray
		});
	}

	addInstruction(e) {
		e.preventDefault();
		let newInstruction = this.recipeInstructions.value;
		if (newInstruction.length > 0 && newInstruction != " ") {
			// make a new instance of the previous ingredient list from state
			let instructionArray = Array.from(this.state.instructions);
			// add new ingredient to that list
			instructionArray.push(newInstruction);
			// reset the state with the new ingredient included on the list
			this.setState({
				instructions: instructionArray
			});
			// resent the value of input to be blank and ready for next ingredient 
			this.recipeInstructions.value= '';
		}
	}
	createInstruction(e){
		if (e.keyCode === 13) {
			this.addInstruction(e);
		}
	}

	removeInstruction(instructionToRemove) {
		// get the index of the ingredient to remove
		let indexOfInstruction = this.state.instructions.indexOf(instructionToRemove);
		// make a new instance of the ingredientsArray from state
		let instructionArray = Array.from(this.state.instructions);
		instructionArray.splice(indexOfInstruction, 1);
		// reset state to the new ingredientsArray without the removed ingredient
		this.setState({
			instructions: instructionArray
		});
	}

	handleTitleChange(e) {
		let titleVal = this.recipeTitle.value;
		// run validation 
		if (titleVal.length <= 1) {
			this.setState({
				titleError: true
			});
		} else {
			this.setState({
				titleError: false
			});
		}
	}

	handleIngredientChange(e) {
		let ingredVal = e.target.value;
		// run validation 
		if (ingredVal.length <= 1) {
			this.setState({
				ingredientError: true
			});
		} else {
			this.setState({
				ingredientError: false
			});
		}
	}

	handleInstructionChange(e) {
		let instructVal = e.target.value;
		// run validation 
		if (instructVal.length <= 1) {
			this.setState({
				instructionError: true
			});
		} else {
			this.setState({
				instructionError: false
			});
		}
	}
	// checkIngredientInput() {
	// 	const newIngredient = this.recipeIngredients.value;
	// 	if (newIngredient.length !== 0) {
	// 		let ingredientArray = [newIngredient];
	// 		// add new ingredient to that list
			
	// 		// console.log('ingredientArray', ingredientArray);
	// 		// console.log(ingredientArray);
	// 		// reset the state with the new ingredient included on the list
	// 		this.setState({
	// 			ingredients: ingredientArray
	// 		});
	// 		// console.log('ingredients thing good', this.state.ingredients);
	// 		// return ingredientArray;

	// 		this.checkInstructionInput();
	// 	} else {
	// 		alert('Please fill out the required fields');
	// 	}
	// }

	// checkInstructionInput() {
	// 	const newInstruction = this.recipeInstructions.value;
	// 	if (newInstruction.length !== 0) {
	// 		// add new ingredient to that list
	// 		let instructionArray = [newInstruction];

	// 		// reset the state with the new ingredient included on the list
	// 		this.setState({
	// 			instructions: instructionArray
	// 		});
	// 		// console.log('instructing thing good', this.state.instructions);
	// 		this.createNewRecipe();
	// 	} else {
	// 		alert('Please fill out the required fields');
	// 	}
	// }
	validateRecipeForm(e) {
		e.preventDefault();
		if(this.state.listFocus === true ) {
			return false;
		} else {
			
			// const newIngredient = this.recipeIngredients.value;
			// if (newIngredient.length !== 0) {
			// 	// add new ingredient to new arr
			// 	let ingredientArray = [newIngredient];
			// 	// reset the state with the new ingredient included on the list
			// 	this.setState({
			// 		ingredients: ingredientArray
			// 	});
			// } else {
			// 	alert('Please fill out the required ingredient field');
			// 	return false;
			// }

			// const newInstruction = this.recipeInstructions.value;
			// if (newInstruction.length !== 0) {
			// 	// add new ingredient to new array
			// 	let instructionArray = [newInstruction];
			// 	// reset the state with the new ingredient included on the list
			// 	this.setState({
			// 		instructions: instructionArray
			// 	});				
			// } else {
			// 	alert('Please fill out the required instruction field');
			// 	return false;
			// }

			// save input values
			const recipeTitle = this.recipeTitle.value;
			let recipeIngredients = this.state.ingredients;
			let recipeInstructions = this.state.instructions;

			if(recipeTitle === '' 
				|| this.state.titleError === true
				|| recipeIngredients.length <= 0
				|| recipeInstructions.length <= 0) {
					alert('Please fill out the required fields');
					return false;
			} else {
				// call createNewRecipe:
				this.createNewRecipe();
			}
		}
	}

	createNewRecipe() {
		// save input values
		const recipeTitle = this.recipeTitle.value;
		const recipePrepTime = this.recipePrepTime.value ? this.recipePrepTime.value : 'unknown';
		const recipeTotalTime = this.recipeTotalTime.value ? this.recipeTotalTime.value : 'unknown';
		const recipeIngredients = this.state.ingredients;
		const recipeInstructions = this.state.instructions;
		const recipeServes = this.recipeServes.value ? this.recipeServes.value : 'unknown';

		// add to recipe object:
		const recipe = {
			title: recipeTitle,
			prepTime: recipePrepTime,
			totalTime: recipeTotalTime,
			ingredients: recipeIngredients,
			instructions: recipeInstructions,
			serves: recipeServes
		};

		// console.log('new recipe', recipe);
		// console.log('user on add recipe', this.props.currentUser);

		// save to firebase db:
		firebase.database().ref(`${this.props.currentUser}/recipe`).push(recipe);

		// clear the inputs
		this.recipeTitle.value = '';
		this.recipePrepTime.value = '';
		this.recipeTotalTime.value = '';
		this.recipeIngredients.value = '';
		this.recipeInstructions.value = '';
		this.recipeServes.value = '';

		// reset the ingredients state:
		this.setState({
			ingredients: [], 
			instructions: [],
			titleError: false, 
			ingredientError: false,
			instructionError: false
		});
	}

	render() {
		return (
			<section>
				<form action="" onSubmit={(e) => this.validateRecipeForm.call(this,e) } className="addRecipe"
					 id="addrecipe" >
					<div className="flower">
						<img src="src/assets/bud.svg" href="Water colour small pink bud"/>
					</div>
					<h2>Add a New Recipe:</h2>
					<div>
						<label className={this.state.titleError ? 'errorLabel' : 'none'}>
							Enter your recipe title:<span className="required">*</span>
						</label>
						
						<input type="text" 
							className={this.state.titleError ? 'error' : 'none'}
							ref={ref => this.recipeTitle = ref}  
							// value={this.state.titleValue} 
							onChange={(e) => this.handleTitleChange.call(this, e) } />

						<label>Enter the prep time:</label>
						<input type="text" ref={ref => this.recipePrepTime = ref}/>

						<label>Enter the total time:</label>
						<input type="text" ref={ref => this.recipeTotalTime = ref}/>

						<label htmlFor="ingredient" className={this.state.ingredientError ? 'errorLabel newIngred' : 'newIngred'}>Enter the ingredients:<span className="required">*</span></label>
						<div>
							<label htmlFor="ingredient" className={this.state.ingredientError ? 'errorLabel plus' : 'plus'} >
								<i className="fa fa-plus"></i>
							</label>
							<input 
								className={this.state.ingredientError ? 'error enterIngred' : 'enterIngred'}
								id="ingredient" type="text" 
								ref={ref => this.recipeIngredients = ref} 
								onKeyDown={(e) => this.createIngredient.call(this,e) } 
								onFocus={(e) => this.listFocus.call(this, e) } 
								onBlur={(e) => this.listUnFocus.call(this, e) } 
								// value={this.state.ingredientValue} 
								onChange={(e) => this.handleIngredientChange.call(this, e) } />
							<button className="add" onClick={(e) => this.addIngredient.call(this,e) }>add</button>
						</div>

						<ul>
							{
								this.state.ingredients.map((ingredient, i) => {
									return(
										<li key={i} className="ingredientList">
											<i className="fa fa-minus deleteIngred" onClick={(e) => this.removeIngredient.call(this, ingredient)}></i>
											<span>{ingredient}</span>
										</li>
									)
								
							})}
						</ul>

						<label htmlFor="instruction" className={this.state.instructionError ? 'errorLabel newInstruct' : 'newInstruct'}>Enter the instructions:<span className="required">*</span></label>
						<div>
							<label htmlFor="instruction" 
								className={this.state.instructionError ? 'errorLabel plus' : 'plus'} >
								<i className="fa fa-plus"></i>
							</label>
							<input 
								className={this.state.instructionError ? 'error enterIngred' : 'enterIngred'}
								type="text" id="instruction" 
								ref={ref => this.recipeInstructions = ref} 
								onKeyDown={(e) => this.createInstruction.call(this,e) } 
								onFocus={(e) => this.listFocus.call(this, e) } 
								onBlur={(e) => this.listUnFocus.call(this, e) }
								// value={this.state.instructionValue} 
								onChange={(e) => this.handleInstructionChange.call(this, e) }
								/>
								<button className="add" onClick={(e) => this.addInstruction(e) }>add</button>
						</div>

						<ul>
							{
								this.state.instructions.map((instruction, i) => {
									return(
										<li key={i} className="instructionList">
											<i className="fa fa-minus deleteInstruction" onClick={(e) => this.removeInstruction.call(this, instruction)}></i>
											<span>{instruction}</span>
										</li>
									)
								
							})}
						</ul>

						<label>Serves:</label>
						<input type="text" ref={ref => this.recipeServes = ref}/>

						<input type="submit" />
					</div>
				</form>
			</section>	
		);
	};
}


// add conversion widget 
// add search for ingredients
// sticky alphabet once you scroll into recipes 