import React from 'react';
import { Table, Button } from 'reactstrap';
import config from '../Config';
import { getPoints } from '../GraphService';
import '@fortawesome/fontawesome-free/css/all.css';

export default class Teams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            all_players: [],
            selected_players: [],
            selected_names: [],
            guest_name: '',
            guest_avg: '',
            team_lobby: [],
            team_one: [],
            team_two: [],
            team_three: [],
            team_four: [],
            team_five: [],
            team_six: [],
            numOfTeams: 0
        }

        this.add_selected_player = this.add_selected_player.bind(this);
        this.remove_selected_player = this.remove_selected_player.bind(this);
        this.makeTeamsABCD = this.makeTeamsABCD.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAvgChange = this.handleAvgChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        try {
            // Get the user's access token
            let accessToken = await window.msal.acquireTokenSilent({
                scopes: config.scopes
            });

            // Get the user's points
            let points = await getPoints(accessToken);
            let players = [];
            points.forEach((player) => {
                players.push(<tr key={player[0]} onClick={this.add_selected_player}><td>{player[0]}</td><td>{player[2]}</td></tr>)
            })

            // Update the array of players in state
            this.setState({ all_players: players });
        }
        catch (err) {
            this.props.showError('ERROR', JSON.stringify(err));
        }
    }

    add_selected_player = (props) => {
        //console.log(props.currentTarget.children[0].innerText);
        let name = props.currentTarget.children[0].innerText;
        let avg = props.currentTarget.children[1].innerText;
        let f_isThere = false;

        console.log("length:", this.state.selected_names.length);
        for (let i = 0; i < this.state.selected_names.length; i++) {
            if (this.state.selected_names[i] === name) {
                f_isThere = true;
                break;
            }
        }
        console.log("flag:", f_isThere);

        if (!f_isThere) {
            console.log("need to update state")
            this.setState({
                selected_players: [...this.state.selected_players, <tr key={name} onClick={this.remove_selected_player}><td>{name}</td><td>{avg}</td></tr>],
                selected_names: [...this.state.selected_names, name]
            }, function () {
                console.log("state updated... sorting players");
                this.state.selected_players.sort(function (a, b) {
                    return b.props.children[1].props.children - a.props.children[1].props.children;
                })
                this.setState({});
            });
        } else {
            console.log("No need to update state. Player already in list.")
        }
    }

    remove_selected_player = (props) => {
        let name = props.currentTarget.children[0].innerText;
        let index = 0;

        for (index; index < this.state.selected_players.length; index++) {
            if (this.state.selected_players[index].props.children[0].props.children === name) { break; }
        }
        this.state.selected_players.splice(index, 1);

        index = 0;
        for (index; index < this.state.selected_names.length; index++) {
            if (this.state.selected_names[index] === name) { break; }
        }
        this.state.selected_names.splice(index, 1);

        this.setState({
            selected_players: this.state.selected_players
        })
    }

    makeTeamsABCD = () => {
        let t_one = [];
        let t_two = [];
        let t_three = [];
        let t_four = [];
        let t_five = [];
        let t_six = [];
        let t_seven = [];
        let t_eight = [];
        let t_nine = [];
        let t_ten = [];

        this.setState({
            team_one: [],
            team_two: [],
            team_three: [],
            team_four: [],
            team_five: [],
            team_six: [],
            team_seven: [],
            team_eight: [],
            team_nine: [],
            team_ten: [],
            team_lobby: []
        }, function () {
            console.log("making teams...");
            let counter = 1;
            let f_isReverse = false;

            for (let i = 0; i < this.state.selected_players.length; i++) {
                console.log("counter", counter)

                if (counter === this.state.numOfTeams + 1 || (counter === 0 && f_isReverse === true)) {
                    if (counter === this.state.numOfTeams + 1) { counter--; }
                    else if (counter === 0) { counter++; }
                    console.log('reverse..')
                    f_isReverse = !f_isReverse;
                }
                if (f_isReverse === false) {
                    this.state.team_lobby.push({
                        name: this.state.selected_players[i].props.children[0].props.children,
                        average: this.state.selected_players[i].props.children[1].props.children,
                        team: counter
                    });
                    counter++;
                } else {
                    this.state.team_lobby.push({
                        name: this.state.selected_players[i].props.children[0].props.children,
                        average: this.state.selected_players[i].props.children[1].props.children,
                        team: counter
                    });
                    counter--;
                }
            }

            this.state.team_lobby.forEach(player => {

                if (player.team === 1) {
                    t_one.push(<tr key={t_one.length}><td>{player.name}</td><td>{player.average}</td></tr>)
                }
                else if (player.team === 2) {
                    t_two.push(<tr key={t_two.length}><td>{player.name}</td><td>{player.average}</td></tr>)
                }
                else if (player.team === 3) {
                    t_three.push(<tr key={t_three.length}><td>{player.name}</td><td>{player.average}</td></tr>)
                }
                else if (player.team === 4) {
                    t_four.push(<tr key={t_four.length}><td>{player.name}</td><td>{player.average}</td></tr>)
                }
                else if (player.team === 5) {
                    t_five.push(<tr key={t_five.length}><td>{player.name}</td><td>{player.average}</td></tr>)
                }
                else if (player.team === 6) {
                    t_six.push(<tr key={t_six.length}><td>{player.name}</td><td>{player.average}</td></tr>)
                }
                else if (player.team === 7) {
                    t_seven.push(<tr key={t_seven.length}><td>{player.name}</td><td>{player.average}</td></tr>)
                }
                else if (player.team === 8) {
                    t_eight.push(<tr key={t_eight.length}><td>{player.name}</td><td>{player.average}</td></tr>)
                }
                else if (player.team === 9) {
                    t_nine.push(<tr key={t_nine.length}><td>{player.name}</td><td>{player.average}</td></tr>)
                }
                else if (player.team === 10) {
                    t_ten.push(<tr key={t_ten.length}><td>{player.name}</td><td>{player.average}</td></tr>)
                }
            })
            this.setState({
                team_one: t_one,
                team_two: t_two,
                team_three: t_three,
                team_four: t_four,
                team_five: t_five,
                team_six: t_six,
                team_seven: t_seven,
                team_eight: t_eight,
                team_nine: t_nine,
                team_ten: t_ten
            })
        })
    }

    increment = () => {
        if (this.state.numOfTeams === 10) { return; }
        this.setState({ numOfTeams: this.state.numOfTeams + 1 });

    }

    decrement = () => {
        if (this.state.numOfTeams === 0) { return; }
        this.setState({ numOfTeams: this.state.numOfTeams - 1 });
    }

    handleNameChange = (event) => {
        this.setState({ guest_name: event.target.value });
    }

    handleAvgChange = (event) => {
        this.setState({ guest_avg: event.target.value });
    }

    handleSubmit = (event) => {
        let f_isThere = false;

        console.log("length:", this.state.selected_names.length);
        for (let i = 0; i < this.state.selected_names.length; i++) {
            if (this.state.selected_names[i] === this.state.guest_name) {
                f_isThere = true;
                break;
            }
        }
        console.log("flag:", f_isThere);

        if (!f_isThere) {
            console.log("need to update state")
            this.setState({
                selected_players: [...this.state.selected_players, <tr key={this.state.guest_name} onClick={this.remove_selected_player}><td>{this.state.guest_name}</td><td>{this.state.guest_avg}</td></tr>],
                selected_names: [...this.state.selected_names, this.state.guest_name]
            }, function () {
                console.log("state updated... sorting players");
                this.state.selected_players.sort(function (a, b) {
                    return b.props.children[1].props.children - a.props.children[1].props.children;
                })
                this.setState({});
            });
        } else {
            console.log("No need to update state. Player already in list.")
        }
        this.setState({
            guest_avg: '',
            guest_name: ''
        })
        event.preventDefault()
    }

    render() {
        return (
            <div>
                <h1>Teams</h1>
                <div style={{ height: 500 }}>
                    <div style={{ height: 500, overflowY: 'scroll', width: '50%', float: 'left' }}>
                        <Table bordered striped style={{}}>
                            <thead>
                                <tr><th colSpan='2' style={{ textAlign: 'center', fontSize: 20 }}>ALL PLAYERS</th></tr>
                                <tr>
                                    <th style={{ position: 'sticky' }}>PLAYER NAME</th>
                                    <th style={{ position: 'sticky' }}>AVERAGE SCORE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.all_players}
                            </tbody>
                        </Table>
                    </div>
                    <div style={{ height: 500, overflowY: 'scroll', width: '50%', float: 'left' }}>
                        <Table bordered striped style={{}}>
                            <thead style={{ textAlign: 'center', fontSize: 20 }}><tr><th colSpan="2">SELECTED PLAYERS: {this.state.selected_players.length}</th></tr></thead>
                            <thead>
                                <tr>
                                    <th>PLAYER NAME</th>
                                    <th>AVERAGE SCORE</th>
                                </tr>
                            </thead>
                            <tbody style={{}}>
                                {this.state.selected_players}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div>
                    <div>
                        <Button onClick={this.increment}>+</Button>
                        <Button onClick={this.decrement}>-</Button>
                        <h2>{this.state.numOfTeams}</h2>
                    </div>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                Guest Name:
                                <input type="text" value={this.state.guest_name} onChange={this.handleNameChange} />
                            </label>
                            <label>
                                Guest Avgerage:
                                <input type='text' value={this.state.guest_avg} onChange={this.handleAvgChange} />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                    <div>
                        <Button onClick={this.makeTeamsABCD}>Make Teams ABCD</Button>
                    </div>
                </div>
                <div>
                    <Table>
                        <thead><tr><th>TEAM 1</th></tr></thead>
                        <tbody>{this.state.team_one}</tbody>
                    </Table>
                    <Table>
                        <thead><tr><th>TEAM 2</th></tr></thead>
                        <tbody>{this.state.team_two}</tbody>
                    </Table>
                    <Table>
                        <thead><tr><th>TEAM 3</th></tr></thead>
                        <tbody>{this.state.team_three}</tbody>
                    </Table>
                    <Table>
                        <thead><tr><th>TEAM 4</th></tr></thead>
                        <tbody>{this.state.team_four}</tbody>
                    </Table>
                    <Table>
                        <thead><tr><th>TEAM 5</th></tr></thead>
                        <tbody>{this.state.team_five}</tbody>
                    </Table>
                    <Table>
                        <thead><tr><th>TEAM 6</th></tr></thead>
                        <tbody>{this.state.team_six}</tbody>
                    </Table>
                    <Table>
                        <thead><tr><th>TEAM 7</th></tr></thead>
                        <tbody>{this.state.team_seven}</tbody>
                    </Table>
                    <Table>
                        <thead><tr><th>TEAM 8</th></tr></thead>
                        <tbody>{this.state.team_eight}</tbody>
                    </Table>
                    <Table>
                        <thead><tr><th>TEAM 9</th></tr></thead>
                        <tbody>{this.state.team_nine}</tbody>
                    </Table>
                    <Table>
                        <thead><tr><th>TEAM 10</th></tr></thead>
                        <tbody>{this.state.team_ten}</tbody>
                    </Table>
                </div>
            </div >
        )
    }
}