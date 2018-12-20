import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import { Alert } from 'reactstrap';
import { Button } from 'reactstrap';
import { Input } from 'reactstrap';
import { Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import * as shoppingCartActions from '../redux/shoppingCart/actions';


class PizzaForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pizzaSizes: null,
            dropdownOpen: false,
            selectedPizzaSize: null,
            numToppingsSelected: 0,
            totalPriceOfToppings: 0.00,
            shoppingCart: [],
            totalPrice: 0.00,

        };


        this.toggleSize = this.toggleSize.bind(this);
        this.selectSize = this.selectSize.bind(this);
        this.selectTopping = this.selectTopping.bind(this);
        this.addCurrentToShoppingCart = this.addCurrentToShoppingCart.bind(this);
    }

    componentDidMount() {
    

        this.props.store.subscribe(() => {


            this.setState({
                pizzaSizes: this.props.store.getState().shoppingCartReducer.pizzaSizes.pizzaSizes,
                pizzaSizeSelected: this.props.store.getState().shoppingCartReducer.pizzaSizeSelected,
            });

            this.countToppings();


        })

        this.props.store.dispatch(shoppingCartActions.getPizzaSizes(() => {

            // success cb

        }, () => {

            // error cb
        }))

    }

    countToppings() {
        // Count the number of selected toppings
        let count = 0;
        let totalPriceOfToppings = 0;

        for (const topping of this.props.store.getState().shoppingCartReducer.pizzaSizeSelected.toppings) {
            count = (topping.defaultSelected) ? count + 1 : count;
            totalPriceOfToppings = (topping.defaultSelected) ? totalPriceOfToppings + topping.topping.price : totalPriceOfToppings;
        }

        this.setState({
            numToppingsSelected: count,
            totalPriceOfToppings: totalPriceOfToppings
        });

    }


    toggleSize() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    selectSize(event, index) {

        this.props.store.dispatch(shoppingCartActions.selectPizzaSize(this.state.pizzaSizes[index], () => {

            // success cb

        }));
    }

    selectTopping(event, index) {
       
        let topping = this.state.pizzaSizeSelected.toppings[index];
        topping.defaultSelected = !topping.defaultSelected;

        this.props.store.dispatch(shoppingCartActions.toggleTopping({ topping, index }, () => {

            // success cb

        }));

    }

    addCurrentToShoppingCart(event, price) {

        // not the beste solution but it works for now
        let pizzaToAdd = JSON.parse(JSON.stringify(this.state.pizzaSizeSelected));

        this.setState(prevState => ({
            shoppingCart: [...prevState.shoppingCart, pizzaToAdd],
            totalPrice: prevState.totalPrice + price,
        }));

    }


    // stateless functional component
    ShoppingCart() {


        if (this.state.shoppingCart.length === 0)
            return (
                <div>Your cart is empty</div>
            );

        return (
            <div>

                {
                    this.state.shoppingCart.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className="bg-warning" key={index}> - {item.name} pizza </div>
                                <Row>
                                    {
                                        item.toppings.map((topping, index) => {

                                            let selected = topping.defaultSelected;
                                            return (
                                                <Col key={index}> {selected && topping.topping.name} </Col>
                                            );

                                        })
                                    }
                                </Row>
                            </div>
                        );
                    })
                }

                <Alert color="success">
                    <div><b> {'\uD83D\uDCB0'} Total Cost: ${this.state.totalPrice.toFixed(2)}</b></div>
                </Alert>
            </div>
        );
    }

    render() {

        // Sizes
        let renderSizes =

            this.state.pizzaSizes && this.state.pizzaSizes.map((pizza, index) => {
                return (
                    <DropdownItem key={index} onClick={(event) => { this.selectSize(event, index) }}>{pizza["name"]}</DropdownItem>
                );
            });



        let renderSizesLabel = this.state.pizzaSizeSelected ? this.state.pizzaSizeSelected["name"] : 'Sizes';



        // Toppings
        let maximumToppings = this.state.pizzaSizeSelected && (this.state.pizzaSizeSelected.maxToppings === null ? '\u221E' : this.state.pizzaSizeSelected.maxToppings);

        let renderToppings = this.state.pizzaSizeSelected && this.state.pizzaSizeSelected.toppings.map((topping, index) => {

            let maxToppings = this.state.pizzaSizeSelected.maxToppings === null ? 9999 : this.state.pizzaSizeSelected.maxToppings;
            let disableCheckbox = (this.state.numToppingsSelected >= maxToppings) &&
                !topping.defaultSelected;
            return (
                <Row key={index}>
                    <Col>
                        <Input key={index} type='checkbox' onChange={(event) => { this.selectTopping(event, index) }} checked={topping.defaultSelected} name={topping.topping.name} disabled={disableCheckbox} /> {topping.topping.name}
                    </Col>
                </Row>
            );
        });

        // Individual Cost
        let baseCost = (this.state.pizzaSizeSelected && this.state.pizzaSizeSelected.basePrice) || 0.00;
        let toppingsCosts = this.state.totalPriceOfToppings;



        return (
            <Container>

                <Row>
                    <Col>
                        <Jumbotron>
                            <h1 className="display-2">Pizza Shop</h1>
                            <p className="lead">Delicious pizza by Bruno Bianchini &copy;</p>
                        </Jumbotron>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Row>
                            <Col xs="2">
                                <h1>1</h1>
                            </Col>
                            <Col>
                                <Alert color="primary">
                                    Select a size
                                </Alert>
                                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleSize}>
                                    <DropdownToggle caret>
                                        {renderSizesLabel}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {renderSizes}
                                        <DropdownItem />
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs="2">
                                <h1>2</h1>
                            </Col>
                            <Col>
                                <Alert color="primary">
                                    Any Toppings?
                                </Alert>
                                <b>Maximum toppings for this size: {maximumToppings}</b>
                                <div>
                                    {renderToppings}
                                </div>

                                <div>Amount selected: {this.state.numToppingsSelected}</div>
                            </Col>

                        </Row>

                        <Row>
                            <Col xs="2">
                                <h1>3</h1>
                            </Col>
                            <Col>
                                <Alert color="success">
                                    <div><b>Cost: ${(baseCost + toppingsCosts).toFixed(2)}</b></div>
                                </Alert>


                                <Button type="submit" onClick={(event) => { this.addCurrentToShoppingCart(event, baseCost + toppingsCosts) }}>Add to cart</Button>
                            </Col>
                        </Row>
                    </Col>

                    <Col>

                        <Alert color="warning">
                            Shopping Cart
                                </Alert>
                        <div> {this.ShoppingCart()} </div>

                        <form>
                            <Button type="submit">Order</Button>
                        </form>
                    </Col>
                </Row>
            </Container >

        );
    }
}

export default PizzaForm;