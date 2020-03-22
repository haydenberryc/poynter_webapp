import React from 'react';
import { Table } from 'reactstrap';
import config from '../Config';
import { getPoints } from '../GraphService';
import '@fortawesome/fontawesome-free/css/all.css';

export default class Points extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: []
        };
    }

    async componentDidMount() {
        try {
            // Get the user's access token
            var accessToken = await window.msal.acquireTokenSilent({
                scopes: config.scopes
            });
            // Get the user's points
            var points = await getPoints(accessToken);
            let players = [];
            points.forEach((player) => {
                players.push(<tr key={player[0]}><td>{player[0]}</td><td>{player[2]}</td></tr>)
            })

            // Update the array of points in state
            this.setState({ players: players });
        }
        catch (err) {
            this.props.showError('ERROR', JSON.stringify(err));
        }
    }

    render() {
        return (
            <div>
                <h1>Points</h1>
                <Table>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Average</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.players}
                    </tbody>
                </Table>
            </div>
        );
    }
}