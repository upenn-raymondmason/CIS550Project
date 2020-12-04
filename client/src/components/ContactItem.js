import React from 'react';
export default class ContactItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.username
        }
    }

    handleContactClick() {
        sessionStorage.setItem('receiver', this.state.username);
        window.location.assign('/messaging');
    }

    render() {
       return (
            <div className="contactItem" onClick = {() => this.handleContactClick()}>
               {this.state.username}
            </div>
        )
    }
}