import React from "react"
import { useState } from "react"
import { useRef } from "react"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"

function SubmitGrievance() {
  const [status, setStatus] = useState(null)

  function showStatus(type) {
    setStatus(type)
    setTimeout(() => setStatus(null), 3000)
  }
  const form = useRef()
  async function handleGrievanceSubmit(e) {
    e.preventDefault()
    const reqBody = {
      fname: form.current.fname.value,
      email: form.current.email.value,
      district: form.current.district.value,
      post: form.current.post?.value,
      board: form.current.board.value,
      issueType: form.current.issueType.value,
      desc: form.current.desc?.value,
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/submitGrievance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        }
      )
      const data = await res.json()
      showStatus("success")
    } catch (err) {
      showStatus("failure")
    }
  }
  return (
    <div>
      <Navbar />

      <div className="flex-col flex items-center">
        {status && (
          <div
            className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white z-50
    ${status === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {status === "success"
              ? "✅ Grievance submitted!"
              : "❌ Submission failed!"}
          </div>
        )}
        <h1 className="text-4xl font-bold my-5">Submit Grievance</h1>
        <form
          ref={form}
          onSubmit={handleGrievanceSubmit}
          method="POST"
          className="w-[300px] md:w-[500px] flex flex-col gap-3 "
        >
          <div>
            <label htmlFor="fname">Full Name</label>
            <input
              required
              id="fname"
              name="fname"
              type="text"
              className="w-full border-1 rounded-sm px-3 py-1 my-1 block"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              required
              type="email"
              className="w-full border-1 rounded-sm px-3 py-1 my-1 block"
            />
          </div>
          <div>
            <label htmlFor="district">District You Belong from</label>
            <select
              name="district"
              id="district"
              className="w-full border-1 rounded-sm px-3 py-1 my-1 block uppercase"
            >
              <option value="Anantnag">Anantnag</option>
              <option value="Bandipora">Bandipora</option>
              <option value="Baramulla">Baramulla</option>
              <option value="Budgam">Budgam</option>
              <option value="Doda">Doda</option>
              <option value="Ganderbal">Ganderbal</option>
              <option value="Jammu">Jammu</option>
              <option value="Kathua">Kathua</option>
              <option value="Kishtwar">Kishtwar</option>
              <option value="Kulgam">Kulgam</option>
              <option value="Kupwara">Kupwara</option>
              <option value="Poonch">Poonch</option>
              <option value="Pulwama">Pulwama</option>
              <option value="Rajouri">Rajouri</option>
              <option value="Ramban">Ramban</option>
              <option value="Reasi">Reasi</option>
              <option value="Samba">Samba</option>
              <option value="Shopian">Shopian</option>
              <option value="Srinagar">Srinagar</option>
              <option value="Udhampur">Udhampur</option>
            </select>
          </div>
          <div>
            <label htmlFor="">Exame Name / Recruiting Body</label>
            <select
              name="board"
              id="board"
              className="w-full border-1 rounded-sm px-3 py-1 my-1 block uppercase"
            >
              <option selected value="jkssb">
                jkssb
              </option>
              <option value="jkpsc">jkpsc</option>
              <option value="highCourt">High Court</option>
              <option value="distAdmin">District Adminstration</option>
              <option value="">Others</option>
            </select>
          </div>
          <div>
            <label htmlFor="post">Post You have applied for</label>
            <input
              name="post"
              id="post"
              type="text"
              className="w-full border-1 rounded-sm px-3 py-1 my-1 block"
            />
          </div>
          <div>
            <label htmlFor="cateory">Type of Issue</label>
            <select
              name="issueType"
              id="issueType"
              className="w-full border-1 rounded-sm px-3 py-1 my-1 block"
            >
              <option selected value="unfairmeans">
                {" "}
                Witnessed Unfairmeans at Exam Center{" "}
              </option>
              <option value="dateDefer">Date deferment</option>
              <option value="refundPending">
                Haven't received the refund for cancelled Exam
              </option>
              <option value="delayedExam">
                Incapable of Conducting exam on Time{" "}
              </option>
              <option value="resultDelay">
                Result / Selection List / Appointment Order Delay
              </option>
              <option value="">Others</option>
            </select>
          </div>

          <div>
            <label htmlFor="">Description of Grievance</label>
            <textarea
              name="desc"
              id="desc"
              rows={3}
              className="w-full border-1 rounded-sm px-3 py-1 my-1 block"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full  bg-blue-700 py-2 rounded-md text-white cursor-pointer hover:bg-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default SubmitGrievance
