import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import requestAPI from '../../../api/index'
import DashboardEditor from './DashboardEditor';
import { useSelector } from 'react-redux';
import notificationCustom from '../../../notification/index';
import axios from 'axios'

export default function DashboardNewsCreate(props) {
    const [cate, setCate] = useState([])

    const cateInput = useRef();
    const [inputValue, setInputValue] = useState({
        categoryId: [],
        description: "",
        idPoster: "",
        listlike: [],
        createdby: null,
        createddate: null,
        modifiedby: null,
        modifieddate: null,
        sub: "",
        title: "",
        urlImage: ""
    })
    const handleOnChange = (event) => {
        setInputValue({ ...inputValue, [event.target.name]: event.target.value })
    }
    const poster = useSelector((state) => state.poster)
    const { categoryId, description, idPoster, listlike, modifiedby, modifieddate, createdby, createddate, sub, title, urlImage } = poster.posterEdit.product
    useEffect(() => {
        setInputValue({
            categoryId,
            description,
            idPoster,
            listlike,
            modifiedby,
            modifieddate,
            createdby,
            createddate,
            sub,
            title,
            urlImage
        })
        requestAPI('/category', 'GET')
            .then(res => {
                if (res) {
                    setCate(res.data)
                }
            })
            .catch(err => {
                if (err.response) {
                    console.log('ERROR :' + err);
                }
            })

    }, [])

    const onSubmit = (event) => {
        event.preventDefault()
        console.log({ inputValue });
        inputValue.modifieddate = new Date();
        requestAPI(`/poster/${idPoster}`, 'PUT', inputValue, { Authorization: `Bearer ${localStorage.getItem('TOKEN')}` })
            .then(res => {
                if (res.data) {
                    notificationCustom("Th??ng B??o", `${res.data}`, "success")
                    props.setToastFunc(true)
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 403) {
                        notificationCustom("Nh???c Nh???", `B???n kh??ng ????? quy???n `, "warning")
                    }
                    if (err.response.status === 500) {
                        notificationCustom("Nh???c Nh???", `Vui l??ng nh???p th??ng tin theo ????ng y??u c???u`, "warning")
                    }
                }
            })
    }

    const addNewCate = () => {
        requestAPI('/category', 'POST', { name: inputValue.cate }, { Authorization: `Bearer ${localStorage.getItem('TOKEN')}` })
            .then(res => {
                if (res) {
                    notificationCustom("Th??ng B??o", `Th??m Th??? Lo???i th??nh c??ng  `, "success")
                    console.log(res.data);
                    setCate(cate => [...cate, { name: inputValue.cate }])
                    cateInput.current.value = ""
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 403) {
                        notificationCustom("Nh???c Nh???", `B???n kh??ng ????? quy???n `, "warning")
                        console.log("B???n kh??ng ????? quy???n");
                    }
                    if (err.response.status === 400) {
                        notificationCustom("Nh???c Nh???", `Th??? Lo???i ???? T???n T???i `, "warning")
                        console.log("Th??? Lo???i ???? T???n T???i");
                    }
                    if (err.response.status === 500) {
                        notificationCustom("Nh???c Nh???", `Vui l??ng nh???p th??ng tin theo ????ng y??u c???u`, "warning")
                        console.log("Vui l??ng nh???p th??ng tin theo ????ng y??u c???u");
                    }
                }
            })
    }
    const handleChangeImage = async (e) => {
        const files = e.target.files[0]
        const data = new FormData()
        data.append('file', files)
        data.append('upload_preset', 'mbookImage')
        axios.post('https://api.cloudinary.com/v1_1/remalw/upload', data)
            .then(res => {
                console.log({ url: res.data.url });
                setInputValue({ ...inputValue, urlImage: res.data.url })
            })
            .catch(err => {
                console.log(err);
            })

    };
    const deleteImg = () => {
        setInputValue({ ...inputValue, urlImage: '' })
    }
    const handleChangeContent = (description) => {
        setInputValue({ ...inputValue, description })
    }
    const [hideText, setHideText] = useState(false)
    const openMenu = props.openMenu;
    useEffect(() => {
        if (openMenu === false) setHideText(true)
        if (openMenu === true) setHideText(false)
    }, [setHideText, openMenu])
    return (
        <div className="DashboardProductInfo" style={hideText === false ? { width: '85%' } : { width: '100%' }}>
            <div className="create-box">
                <div className="create-box-title flex">
                    <div className="create-box-title-text">
                        Th??ng Tin B??i Vi???t
                    </div>
                    <div
                        className="create-box-title-close flex-center-dashboard"
                        onClick={() => {
                            props.setCloseEditFunc(false);
                        }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
                <form onSubmit={onSubmit} >
                    <div className="create-box-row flex">
                        <div className="dashboard-left flex">Title</div>
                        <div className="dashboard-right">
                            <input
                                type="text" name="title"
                                value={inputValue?.title || ""}
                                onChange={handleOnChange} required
                            ></input>
                        </div>
                    </div>
                    <div className="create-box-row flex">
                        <div className="dashboard-left flex">Sub</div>
                        <div className="dashboard-right">
                            <input
                                type="text" name="sub"
                                value={inputValue?.sub || ""}
                                onChange={handleOnChange} required
                            ></input>
                        </div>
                    </div>
                    <div className="create-box-row flex">
                        <div className="dashboard-left flex">Images </div>
                        <div className="dashboard-right">
                            <input
                                onChange={handleChangeImage}
                                type="file"
                                accept="image/*"
                                name="urlImage"
                                className="noborder"
                                multiple="multiple"
                                style={{ height: '50px' }}
                            ></input>
                            <div className="flex" style={{ overflowY: 'hidden', flexWrap: 'wrap' }}>
                                {inputValue.urlImage ?
                                    <div className="create-box-img">
                                        <img src={inputValue.urlImage} alt="Products-image" />
                                        <div className="create-box-img-overlay">
                                            <p onClick={deleteImg} className="icon">X</p>
                                        </div>
                                    </div>
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                    <div style={{ border: '1px #ddd solid' }}>
                        <DashboardEditor
                            newsContent={inputValue?.description}
                            setNewsContent={handleChangeContent}
                        />
                    </div>
                    <div className="flex-center-dashboard" style={{ marginTop: '40px' }}>
                        <button className="create-box-btn btn">
                            Edit Poster
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}