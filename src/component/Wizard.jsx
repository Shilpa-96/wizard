import React, { useState, useEffect } from 'react';
import {db} from "../firebaseConfig"

import {addDoc,collection,getDocs,deleteDoc,doc,updateDoc} from "firebase/firestore"


const Wizard = () => {

  const [step, setStep] = useState(1);
  const [error,setError]=useState("")
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    dob: '',
    mobile: '',
    email: ''
  });
  const [id,setId] = useState()
  const [count,setCount] =useState(0)

//   database assignment
  const userDetails = collection(db, "users")

//   validate form1
  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError("Name is reuired")
      return false
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false
    }
    if (!formData.dob.trim()) {
      setError('Date of Birth is required');
      return false
    }else if(calculateAge()<18 || calculateAge()>=100){
        setError("Sorry! You need to be 18+ or within 100")
        return false
    }
    setError("")
    return true;
  };

//   validate whether age is within 18 and 100
  const calculateAge = () => {
    const today = new Date();
    const birthDate = new Date(formData.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

//   validate form 2
  const validateStep2 = () => {
    if (!formData.mobile.trim()) {
      setError('Mobile number is required');
      return false
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      setError('Mobile number must be 10 digits');
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      setError('Email address is invalid');
      return false
    }
    setError("");
    return true;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

//   insert new data or update existing data
  const handleSubmit = async () => {
    //  console.log("submit",count)
    let validated;
    if(step===1){
        validated=validateStep1()
    }
    else{
        validated=validateStep2()
    }
    // console.log(validated)
    if(validated){
        if(count===0){
             await addDoc(userDetails,formData)     //insert new data
             setCount(count+1)
        }
        else{
            updateDoc(doc(db,'users',id),formData)  //we need to update the data if we click next button on the second form or if we click next on the fist form for the second time.
        }  
    if (step < 3) {
      setStep(step + 1);
    }
    
    // console.log(count)
    }
  };

  const handlePrevious = () => {
    if(count===1){
        fetchData();
        setCount(count+1)
    }
    // console.log("previous",count)
    
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleClear = async () => {
    await deleteDoc(doc(db,'users',id))
    setFormData({
      name: '',
      address: '',
      dob: '',
      mobile: '',
      email: ''
    });
    setStep(1);
  };

   const fetchData = async () => {
      const snapshot = await getDocs(userDetails);
      if (!snapshot.empty) {
        const data = snapshot.docs[snapshot.docs.length - 1].data();
        setId(snapshot.docs[snapshot.docs.length - 1].id)
        setFormData(data);
      }
    };

  return (
    <div className='wizard-container'>
      {step === 1 && (
        <form>
            <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required/>
          <br/><label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required/>
            <br/><label>DOB</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required/>
          <br/>
        </form>
        

      )}
      {step === 2 && (
        <form>
            <label>Mobile Number</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} reuired/>
          <br/><label>Email Address</label>
          <input type="text" name="email" value={formData.email} onChange={handleChange} required/>
        </form>
      )}
      {step === 3 && (
        <div className="user-details">
    <div className="data-row">
      <label>Name:</label>
      <span>{formData.name}</span>
    </div>
    <div className="data-row">
      <label>Address:</label>
      <span>{formData.address}</span>
    </div>
    <div className="data-row">
      <label>Date of Birth:</label>
      <span>{formData.dob}</span>
    </div>
    <div className="data-row">
      <label>Mobile:</label>
      <span>{formData.mobile}</span>
    </div>
    <div className="data-row">
      <label>Email:</label>
      <span>{formData.email}</span>
    </div>
        </div>
      )}
      {error && <p>{error}</p>}
      <section>
        
     <button style={{visibility:step===1?"hidden":"visible "}}onClick={handlePrevious}>Previous</button>
     {step!==3?<button onClick={handleSubmit}>Next</button>:<button onClick={handleClear}>Clear</button>}
     </section>
     
    </div>
  );
};

export default Wizard;
