import React,{Component} from 'react';
import Aux from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger' ;
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES={
    salad:10,
    cheese:20,
    meat:50,
    bacon:10,
}

class BurgerBuilder extends Component{
    state={
        ingredients:null,
        totalPrice:4,
        purchasable:false,
        purchasing:false,
        loading:false,
    }


    componentDidMount(){
        axios.get('https://burger-builder-834dd-default-rtdb.firebaseio.com/ingredients.json')
        .then(response=>{
            this.setState({ingredients:response.data});
        })
    }


    purchaseCancelHandler=()=>{
        this.setState({purchasing:false});
    }
    purchaseContinueHandler=()=>{
       this.setState({loading:true});
        const order={
            ingredients:this.state.ingredients,
            price:this.state.totalPrice,
            customer:{
                name:'riju',
                address:'nab',
            }
        }
        axios.post('/orders.json',order)
        .then(response=>this.setState({loading:false,purchasing:false}))
        .catch(err=>this.setState({loading:false,purchasing:false}));
    }

    purchaseHandler=()=>{
        this.setState({purchasing:true});
    }

    updatePurchaseState(ingredients){
        
        const sum=Object.keys(ingredients)
        .map(igKey=>{
            return ingredients[igKey];
        })
        .reduce((sum,el)=>{
            return sum+el;
        },0);
        this.setState({purchasable:sum>0});
    }


    addIngredientHandler=(type)=>{
        const oldCount=this.state.ingredients[type];
        const updatedCount=oldCount+1;
        const updatedIngredients={
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        const priceAddition=INGREDIENT_PRICES[type];
        const oldPrice=this.state.totalPrice;
        const newPrice=oldPrice+priceAddition;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
        }

    removeIngredientHandler=(type)=>{
        const oldCount=this.state.ingredients[type];
        if(oldCount>0)
        {
            const updatedCount=oldCount-1;
        const updatedIngredients={
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        const priceSubstraction=INGREDIENT_PRICES[type];
        const oldPrice=this.state.totalPrice;
        const newPrice=oldPrice-priceSubstraction;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients})
        this.updatePurchaseState(updatedIngredients);    
    }
        
    }
    render(){
        const disabledInfo={
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key]=disabledInfo[key]<=0;
        }
        let orderSummary=null;
        if(this.state.loading){
            orderSummary=<Spinner/>
        }
        let burger=<Spinner/>
        if(this.state.ingredients){

         burger=(
            <Aux>
                  <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                purchasable={this.state.purchasable}
                ordered={this.purchaseHandler}
                price={this.state.totalPrice}
             />
            </Aux>
        );

        
        orderSummary=<OrderSummary 
                    purchaseCancel={this.purchaseCancelHandler}
                    price={this.state.totalPrice}
                    purchaseContinue={this.purchaseContinueHandler}
                    ingredients={this.state.ingredients}/>;
        }

        if(this.state.loading){
            orderSummary=<Spinner/>
        }
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}> 
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )

    }
}

export default BurgerBuilder;