import React, {Component} from 'react';
import Diamondboardshow from './Diamondboardshow';
class Diamondboardlayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diamondCount: 0,
    }
  }

  incrementDiamond = () => {
    this.setState({
      diamondCount: this.state.diamondCount + 1,
    }, () =>{ console.log(this.state.diamondCount); if(this.state.diamondCount === 8) alert('game over!');})    
  }

  render(){
    return(
      <div>
        <div className="row">
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />

        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >

          <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond}  />
          {/* <Counter countfunction = {this.countfunction}/> */}

          
          
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false}  incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />

        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond}/>
          {/* <Counter countfunction = {this.countfunction}/> */}

        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond}/>
          {/* <Counter countfunction = {this.countfunction}/> */}

        </div>
      </div>
      <div className="row">
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false}  incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} />
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass">
          <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
        <div className="col-lg-1 buttonclass" >
          <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond}/>
        </div>
      </div>
      
      </div>
      
    )
  }


}
export default Diamondboardlayout