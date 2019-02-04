import React , {Component} from 'react';
import { library, counter } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faGem, faThList } from '@fortawesome/free-solid-svg-icons';
class Diamondboard  extends Component {
  constructor(props){
    super(props);
    this.state = {
      show :false,
      empty : "?",
      count : 0,
    }
  }


  showDiamond = () =>{
    if (this.props.isDiamond) {
      if(!this.state.show) {
        this.setState({
          show: true,
        }, () => this.props.incrementDiamond())        
      }     
    }
    else {
      // TODO: implement direction to diamond
      this.setState({
        empty: "",
      })
      return;
    }
  }

  showDiamondnull =() =>{
    console.log(this.state.empty)
    this.setState({
      empty : "",
    })
    
  }
  countfunction = () =>{
    console.log("came here")
     this.setState({
       count : this.state.count +1,
     })
  }

  render() {
    const { show ,count} = this.state;
    const { isDiamond } = this.props;
    if (isDiamond) {
      if (show) {
        return (
          <div>
            <div className="item" onClick={this.showDiamond} >
              <FontAwesomeIcon icon={faGem} />
              {/* <Counter countfunction = {this.countfunction} /> */}
            </div>
          </div>
        )
       
        
      }
      else {
        return (
          <div className="item" onClick={this.showDiamond}> ?</div>
        )
      }
    }
    else {

      return (
        <div className="item" onClick={this.showDiamond} >
          {this.state.empty}
        </div>
      )

    }
  }
}
export default Diamondboard;