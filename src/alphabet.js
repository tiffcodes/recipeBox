import React from 'react';

export default class AlphabetContainer extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			showNoLetterMessage: false
		}
	}
	checkExisting(letter) {
		if (document.getElementById(letter)) {
			this.setState({
				showNoLetterMessage: false
			})
		} else {
			this.setState({
				showNoLetterMessage: true
			})
		}
	}
	showNoLetterMessage() {
		if (this.state.showNoLetterMessage === true ) {
			// document.getElementById('alphabet').appendChild(element);
			return 	<p className="noRecipesWithLetter">There are no recipes that start with that letter yet!</p>
		}
	}
	render() {
		const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
		return (
			<div id="alphabet">
				<h3 id="recipeList">{this.props.isGlobal ? 'All Public Recipes:' : 'My Recipes:'}</h3>
				<ul className="alphabet">
					{alphabet.map((letter, i) => {
						return (
							<li key={i}>
								<a href={`#${letter}`} onClick={e => this.checkExisting.call(this, letter)}>{letter}</a>
							</li>
						)
					})}
				</ul>
				{this.showNoLetterMessage()}
			</div>	
		)
	}
}