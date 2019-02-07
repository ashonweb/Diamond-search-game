import React, {Component} from 'react';
import Modal from 'react-awesome-modal';
import Diamondboardshow from './Diamondboardshow';
class Diamondboardlayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diamondCount: 0,
      countq : 56,
      visible :false,
    }
  }

  incrementDiamond = () => {
    this.setState({
      diamondCount: this.state.diamondCount + 1,
    }, () => {
      console.log(this.state.diamondCount);
      if (this.state.diamondCount === 8) {
        this.setState({
          visible: true,
        })

        // alert('game over!'); alert( this.state.countq  + "is yout score")
      };
    })    
  }

  countmark = () => {
    this.setState({
      countq: this.state.countq - 1,
    }, () =>{ console.log(this.state.countq);if(this.state.diamondCount === 8) alert(this.state.countq);})
  }
  closeModal = () =>{
    this.setState({
      visible : false
    });
  }

  render() {
    
    return (
      <div>
        <div className="row">
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />

          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >

            <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />
            {/* <Counter countfunction = {this.countfunction}/> */}



          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />

          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />
            {/* <Counter countfunction = {this.countfunction}/> */}

          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />
            {/* <Counter countfunction = {this.countfunction}/> */}

          </div>
        </div>
        <div className="row">
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass">
            <Diamondboardshow isDiamond={true} incrementDiamond={this.incrementDiamond} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
          <div className="col-lg-1 buttonclass" >
            <Diamondboardshow isDiamond={false} incrementDiamond={this.incrementDiamond} countmark={this.countmark} />
          </div>
        </div>
        <Modal visible = {this.state.visible} width="400" height="200" margin-top="200" effect="fadeInUp" onClickAway = {() => this.closeModal()}>
        <div >
            <p class ="gameover">Game Over !!! </p>
            <p> Your score is  {this.state.countq}</p>
            <div>
            <input class = "okbutton  "type="button" value="OK" onClick={() => this.closeModal()} />

            </div>
          </div>
        </Modal>
      </div>

    )
  }
}
export default Diamondboardlayout