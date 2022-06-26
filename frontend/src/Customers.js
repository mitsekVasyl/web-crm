import React, {Component} from 'react';
import CustomersService from "./CustomersService";

const customerService = new CustomersService();


class CustomersList extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            nextPageUrl: '',
        };
        this.nextPage = this.nextPage.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        let self = this;
        customerService.getCustomers().then(function (result) {
            self.setState({customers: result.data, nextPageURL: result.next_link})
        });
    }

    handleDelete(e, customerId) {
        let self = this;
        customerService.deleteCustomer({customerId: customerId}).then(() => {
            let newArr = self.state.customers.filter(function (obj) {
                return obj.customerId !== customerId;
            });
            self.setState({customers: newArr})
        });
    }

    nextPage() {
        let self = this;
        customerService.getCustomersByURL(this.state.nextPageURL).then((result) => {
            self.setState({customers: result.data, nextPageURL: result.next_link})
        });
    }

    render() {
        return (
            <div className="customers--list">
                <table className="table">
                    <thead key="thead">
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.customers.map(c =>
                        <tr key={c.pk}>
                            <td>{c.pk}  </td>
                            <td>{c.first_name}</td>
                            <td>{c.last_name}</td>
                            <td>{c.phone}</td>
                            <td>{c.email}</td>
                            <td>{c.address}</td>
                            <td>{c.description}</td>
                            <td>
                                <button onClick={(e) => this.handleDelete(e, c.pk)}> Delete</button>
                                <a href={"/customer/" + c.pk}> Update</a>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
                <button className="btn btn-primary" onClick={this.nextPage}>Next</button>
            </div>
        );
    }
}


class CustomerCreateUpdate extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const {match: {params}} = this.props;
        if (params && params.pk) {
            customerService.getCustomer(params.pk).then((c) => {
                this.refs.firstName.value = c.first_name;
                this.refs.lastName.value = c.last_name;
                this.refs.email.value = c.email;
                this.refs.phone.value = c.phone;
                this.refs.address.value = c.address;
                this.refs.description.value = c.description;
            })
        }
    }

    handleCreate() {
        customerService.createCustomer(
            {
                "first_name": this.refs.firstName.value,
                "last_name": this.refs.lastName.value,
                "email": this.refs.email.value,
                "phone": this.refs.phone.value,
                "address": this.refs.address.value,
                "description": this.refs.description.value
            }
        ).then((result) => {
            alert("Customer created!");
        }).catch(() => {
            alert('There was an error! Please re-check your form.');
        });
    }

    handleUpdate(pk) {
        customerService.updateCustomer(
            {
                "pk": pk,
                "first_name": this.refs.firstName.value,
                "last_name": this.refs.lastName.value,
                "email": this.refs.email.value,
                "phone": this.refs.phone.value,
                "address": this.refs.address.value,
                "description": this.refs.description.value
            }
        ).then((result) => {
            console.log(result);
            alert("Customer updated!");
        }).catch(() => {
            alert('There was an error! Please re-check your form.');
        });
    }

    handleSubmit(event) {
        const {match: {params}} = this.props;

        if (params && params.pk) {
            this.handleUpdate(params.pk);
        } else {
            this.handleCreate();
        }

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label>
                        First Name:</label>
                    <input className="form-control" type="text" ref='firstName'/>

                    <label>
                        Last Name:</label>
                    <input className="form-control" type="text" ref='lastName'/>

                    <label>
                        Phone:</label>
                    <input className="form-control" type="text" ref='phone'/>

                    <label>
                        Email:</label>
                    <input className="form-control" type="text" ref='email'/>

                    <label>
                        Address:</label>
                    <input className="form-control" type="text" ref='address'/>

                    <label>
                        Description:</label>
                    <textarea className="form-control" ref='description'></textarea>


                    <input className="btn btn-primary" type="submit" value="Submit"/>
                </div>
            </form>
        );
    }
}


export {CustomersList, CustomerCreateUpdate};
