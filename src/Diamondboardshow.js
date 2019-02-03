import React , {Component} from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faGem } from '@fortawesome/free-solid-svg-icons';
class Diamondboard  extends Component {
  constructor(props){
    super(props);
    this.state = {
      show :false
    }
  }


  showDiamond = () =>{
    if(this.props.isDiamond) { 
      this.setState({
        show : this.state.show ? false:true,
      }
      )
     }
     else {
      // TODO: implement direction to diamond
      return ;
    }
  }
  render(){
    const {show} = this.state;
    const {isDiamond} = this.props;
    if (isDiamond) {
      if (show) {
        return (
          <div className="item" onClick={this.showDiamond}>
          <FontAwesomeIcon icon={faGem} />
            
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
        <div className="item" onClick={this.showDiamondnull} >
          ?   </div>
      )

    }
  }
}
export default Diamondboard;