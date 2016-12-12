import React from 'react';

export default class RecipeCard extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			recipeSaved: false,
			recipeShared: false
		}
	}	

	componentWillMount() {

	}

	removeRecipe(recipeToRemove) {
		firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToRemove.key}`).remove();
	}

	saveToMyRecipes(recipeToSave) {
		firebase.database().ref(`recipe/${recipeToSave.key}`).on('value',  (res) => {
			const data = res.val();
			// save to firebase db:
			firebase.database().ref(`${this.props.currentUser}/recipe`).push(data);
			this.setState({
				recipeSaved: true
			})
		});
		
	}

	shareRecipe(recipeToShare) {
		firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToShare.key}`).on('value',  (res) => {
			const data = res.val();
			// save to firebase db:
			firebase.database().ref('recipe').push(data);
			this.setState({
				recipeShared: true
			})
		});
	}

	render() {
		return (
			<div className="recipe" id={this.props.checkAlphabet(this.props.firstLetter, this.props.alphabet)} >
				{ (() => {
					if(this.props.isGlobal && this.state.recipeSaved === false) {
						return <i className="fa fa-bookmark-o" onClick={(e) => this.saveToMyRecipes.call(this, this.props.recipe)}></i>
					} else if (this.props.isGlobal && this.state.recipeSaved) {
						return <i className="fa fa-bookmark"></i>
					} else {
						return <i className="fa fa-times" onClick={(e) => this.removeRecipe.call(this, this.props.recipe)}></i>
					}
					})()
				}

				{ (() => {
					if(this.props.isGlobal === false 
						&& this.state.recipeShared === false) {

						return <i className="fa fa-share" onClick={(e) => this.shareRecipe.call(this, this.props.recipe)}></i>

					} else if (this.props.isGlobal === false 
						&& this.state.recipeShared){
						
						return <i className="fa fa-share green"></i>

					}
					})()
				}
				
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