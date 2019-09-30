import React, { Component } from 'react';
import './Home.css';
import '../../assets/font-awesome-4.7.0/css/font-awesome.min.css'
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const styles = theme => ({
    nullRestaurantList: {
        marginTop: 15,
        marginLeft: 25,
    },
    restaurantCardsGridList: {
        margin: 'auto',
    },
    restaurantCard: {
        width: 250,
        maxWidth: 250,
        height: 340,
        maxHeight: 340,
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 25,
        marginRight: 5,
        paddingBottom: 15,
        cursor: 'pointer',
    },
    restaurantCardMedia: {
        height: 140
    },
    restaurantName: {
        marginBottom: 20,
    },
    ratingAvgRateDiv: {
        position: 'absolute',
        bottom: 20,
    },
    restaurantRatingDiv: {
        backgroundColor: '#EACC5E',
        width: 100,
        textAlign: 'center',
        float: 'left'
    },
    restaurantRatingText: {
        color: 'white',
    },
    restaurantAvgRateText: {
        marginLeft: 30,
        float: 'right',
    },
});

class Home extends Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            cards: 2,
        }
    }

    componentWillMount() {
        // clear existing cart
        sessionStorage.removeItem('customer-cart');
    
        // get restaurants from api
        let that = this;
        let dataRestaurants = null;
        let xhrRestaurants = new XMLHttpRequest();
        xhrRestaurants.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                that.setState({
                    restaurants: JSON.parse(this.responseText).restaurants
                })
            }
        })
        xhrRestaurants.open('GET', `${this.props.baseUrl}restaurant`);
        xhrRestaurants.send(dataRestaurants);

        this.updateCardsGridListCols();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateCardsGridListCols);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateCardsGridListCols);
    }

    updateCardsGridListCols = () => {
        if (window.innerWidth >= 1530) {
            this.setState({ cards: 5 });
            return;
        }

        if (window.innerWidth >= 1270) {
            this.setState({ cards: 4 });
            return;
        }

        if (window.innerWidth >= 1000) {
            this.setState({ cards: 3 });
            return;
        }

        this.setState({ cards: 2 });
    }

    restaurantCardTileOnClickHandler = (restaurantId) => {
        this.props.history.push('/restaurant/' + restaurantId);
    }

    searchHandler = (event) => {
        let that = this;
        let dataRestaurants = null;
        let xhrRestaurants = new XMLHttpRequest();
        xhrRestaurants.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                if (!JSON.parse(this.responseText).restaurants) {
                    that.setState({
                        restaurants: null,
                    })
                } else {
                    that.setState({
                        restaurants: JSON.parse(this.responseText).restaurants,
                    })
                }
            }
        })
        if (event.target.value === '') {
            xhrRestaurants.open('GET', `${this.props.baseUrl}restaurant`);
        } else {
            xhrRestaurants.open('GET', `${this.props.baseUrl}restaurant/name/${event.target.value}`);
        }
        xhrRestaurants.send(dataRestaurants);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {/* header with search box */}
                <Header
                    showSearchBox={true}
                    searchHandler={this.searchHandler}
                />

                {this.state.restaurants === null ?
                    <Typography className={classes.nullRestaurantList} variant='h6'>
                        No restaurant with the given name.
                    </Typography>
                    :
                    <GridList
                        className={classes.restaurantCardsGridList}
                        cols={this.state.cards}
                        cellHeight='auto'
                    >
                        {this.state.restaurants.map(restaurant => (
                            <GridListTile
                                onClick={() => this.restaurantCardTileOnClickHandler(restaurant.id)}
                                key={'restaurant' + restaurant.id}
                            >

                                {/* restaurant details card */}
                                <Card className={classes.restaurantCard} style={{ textDecoration: 'none' }}>
                                    <CardMedia
                                        className={classes.restaurantCardMedia}
                                        image={restaurant.photo_URL}
                                        title={restaurant.restaurant_name}
                                    />
                                    <CardContent>

                                        {/* restaurant name */}
                                        <Typography className={classes.restaurantName} gutterBottom variant='h5' component='h2'>
                                            {restaurant.restaurant_name}
                                        </Typography>

                                        {/* restaurant categories */}
                                        <Typography variant='subtitle1'>
                                            {restaurant.categories}
                                        </Typography>

                                        <div className={classes.ratingAvgRateDiv}>
                                            {/* restaurant rating */}
                                            <div className={classes.restaurantRatingDiv}>
                                                <Typography className={classes.restaurantRatingText} variant='body2'>
                                                    <i className="fa fa-star"></i> {restaurant.customer_rating} ({restaurant.number_customers_rated})
                                                </Typography>
                                            </div>

                                            {/* restaurant average price */}
                                            <Typography className={classes.restaurantAvgRateText} variant='body2'>
                                                <i className="fa fa-inr"></i>{restaurant.average_price} for two
                                            </Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            </GridListTile>
                        ))}
                    </GridList>
                }
            </div>
        );
    }
}

export default withStyles(styles)(Home);