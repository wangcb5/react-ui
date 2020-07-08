import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import tool from '@core/tool'
import Ajax from '@core/fetch'

class LeUpload extends Component{
    static propTypes = {
        label: PropTypes.string,
        analysis: PropTypes.func.isRequired,
        url: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        keyname: PropTypes.string.isRequired,
        type: PropTypes.string,
        size: PropTypes.number,
        multiple: PropTypes.bool
    };

    static defaultProps = {
        label: '',
        url: '',
        disabled: false,
        keyname: '',
        type: '',
        size: 0,
        multiple: false
    };

    constructor() {
        super();
        this._idSeed = tool._idSeed.newId();
        this.state = {
            focus: false,
            values: []
        }
    }
    /********** 生命周期 start  **************/
    componentDidMount() {
        document.body.addEventListener('click', this.bodyClick);
    }
    componentWillUnmount() {
        document.body.removeEventListener('click', this.bodyClick);
    }
    /********** 生命周期 end  **************/

    /********** method start  **************/
    bodyClick=(e)=> {
        const {focus} = this.state;
        const {disabled} = this.props;
        if (disabled)return;
        if (!focus) return;
        this.setState({
            focus: false
        })
    };

    checkType(fileList){
        const {type} = this.props;
        if(!type){
            return true;
        }
        let count = 0;
        for(let i=0;i<fileList.length;i++){
            let fileName = fileList[i].name;
            let suffix = fileName.substring(fileName.lastIndexOf('.')+1);
            if(type.indexOf(suffix) == -1){
                count++;
            }
        }
        if(count != 0){
            return false;
        }
        return true;
    };
    checkSize(fileList){
        const {size } = this.props;
        if(size == 0){
            return true;
        }
        let count = 0;
        for(let i=0;i<fileList.length;i++){
            let fileSize = fileList[i].size;
            if(fileSize > size * 1024 *1024){
                count++;
            }
        }
        if(count != 0){
            return false;
        }
        return true;
    }
    getMaxIndex(){
        const srcs = this.state.values;
        let tmp = [];
        srcs.forEach(x=>{
            tmp.push(x.idx);
        });
        if(tmp.length != 0){
            tmp.sort((a,b)=>{
                return b - a;
            })
            return tmp[0] + 1;
        }else{
            return 1;
        }
    }
    clearFileList=()=> {
        this.setState({
            values: []
        })
    }
    getFileNameList(values) {
        const {multiple} = this.props;
        if (!values.length) return null;
        if (multiple) {
            return  values.map((item, index) => {
                return <span key={index} onClick={() => window.open(item.name)} className="le_upload_box_fileItem" ><span>{item.name}</span></span>
            })
        } else {
            return <span>{values[0].name}</span>
        }
    }
    getFile() {
        return this.state.values
    }

    upload(fileList, value) {
        const {keyname, url, analysis, multiple} = this.props;
        if(!url || !keyname){
            alert('必须配置url和keyname');
            if (this.state.values.length) {
                this.setState({
                    values: []
                });
            }
            return;
        }

        let formData = new FormData();
        for (let i = 0 ; i < fileList.length; i++) {
            formData.append(keyname, fileList[i])
        }

        Ajax.uploadFetch(url,formData).then((result) => {
            let srcs = tool.object.cloneObj(this.state.values);
            let src = analysis?analysis(result):result;
            alert('上传成功');
            //多文件上传
            if(multiple){
                src && src.split(',').forEach(x=>{
                    srcs.push({name:x,idx:this.getMaxIndex()});
                })
            }else{
                srcs = [{name:src,idx:1}];
            }
            this.setState({
                values: srcs
            })
        }).catch((err) => {
            alert("上传异常");
        });
    }

    /********** method end  **************/

    /********** event start  **************/
    onClick=(event)=> {
        event.preventDefault();
        const {disabled} = this.props;
        if (disabled)return;
        document.getElementById(this._idSeed).click();
        this.setState({
            focus: true
        })
    };
    onChange=(event)=> {
        const {size, disabled} = this.props;
        if (disabled)return;
        event.preventDefault();
        let fileInput = document.getElementById(this._idSeed);
        if (!fileInput.value)return;
        if (!this.checkType(fileInput.files)){
            alert('不支持的类型');
            return;
        }
        if (!this.checkSize(fileInput.files)){
            alert('上传文件不能大于' + size + 'MB');
            return;
        };
        this.upload(fileInput.files, fileInput.value);
    };
    /********** event end  **************/

    render() {
        const {focus, values} = this.state;
        const {label, multiple, disabled} = this.props;
        const fileListHtml = this.getFileNameList(values);
        return (
            <div className='le_upload_box'>
                <div className={`le_upload_box_slot ${focus ? 'line' : ''} ${(focus || values.length) ? 'active' : ''} ${disabled ? 'disabled' : ''}`}>
                    <div className='le_upload_box_field_text'>
                        <label
                            htmlFor={this._idSeed}
                            className={`le_upload_box_field_label ${focus ? 'line' : ''} ${(focus || values.length) ? 'active' : ''}`}
                        >{label}</label>
                        <div className="le_upload_box_field_chips" onClick={this.onClick}>
                            {fileListHtml}
                        </div>
                        <input
                            id={this._idSeed}
                            type="file"
                            onChange={this.onChange}
                            multiple={multiple}
                        />
                    </div>
                    <div className="le_upload_box_icon" style={{display: values.length ? '' : 'none'}}>
                        <i onClick={this.clearFileList} className='fa fa-times-circle'></i>
                    </div>
                </div>
            </div>
        );
    }
}

export default LeUpload