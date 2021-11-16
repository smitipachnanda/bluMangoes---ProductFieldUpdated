import React, { Component } from "react";
import AutoCompletemulti from "../Actions/Controls/AutoComplete/autoCompleteMultiple";
import {
  Configuration,
  getDataTable,
  MandatoryFormFields,
} from "../Configuration";
import MAP from "./MODAL/frmAttributeCatMap";
import AntD from "../Actions/Controls/Table/AntDTable";
import MultipleDataNoparent from "../Actions/Controls/Table/MultipleDataNoparent";
import "../ORDER/OrderMaster/style.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Modal, Spin } from "antd";
import "sweetalert2/src/sweetalert2.scss";
export default class FrmProdFieldUpdated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginId: 0,
      fielddata: [],
      catid: "",
      catname: "",
      val: "",
      fldname: "",
      options: [],
      updateData: false,
      updateid: "",
      discription1: "",
      discription2: "",
      discription3: "",
      Pid: [],
      loading: false,
    };
  }
  async componentDidMount() {
    await this.setState({
      loginId: Configuration.USER_ID,
    });
    await this.getdata();
  }
  async getdata() {
    this.setState({ loading: true });
    let Que = "exec GetAttributeMasterList";
    let rs = await getDataTable(Que);
    this.setState({
      fielddata: rs,
      updateid: "",
      updateData: false,
      fldname: "",
      discription1: "",
      discription2: "",
      discription3: "",
      Pid: [],
      loading: false,
    });
  }
  myChangeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  async onAutoCOmpletMultiPleSelect(selectedOptions, name) {
    if (selectedOptions.length > 0) {
      this.setState({
        [name]: selectedOptions,
        ImageData: [],
      });
    } else {
      this.setState({
        [name]: "",
        ImageData: [],
      });
    }
  }
  async SavePortal() {
    this.setState({ loading: true });
    let MandatoryArray = [
      { "Attribute Name": this.state.fldname },
      { "Value Type": this.state.val },
    ];
    let check = MandatoryFormFields(MandatoryArray);
    if (check == false) {
      this.setState({ loading: false });
      return false;
    }
    if (this.state.val === "Option" && this.state.options.length <= 0) {
      Swal.fire({
        icon: "error",
        title: "PLEASE ADD VALUES FOR OPTION TYPE",
        showConfirmButton: false,
        timer: 1500,
      });
      this.setState({ loading: false });
      return;
    }

    let data = [];
    let Que =
      "Select * from AttributeMaster where AttributeName = '" +
      this.state.fldname +
      "' and dis = 0";
    let rs = await getDataTable(Que);

    if (rs.length > 0) {
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Already Exist",
        showConfirmButton: false,
        timer: 1500,
      });
      this.setState({ loading: true });
      return;
    }
    let Query =
      "INSERT INTO  AttributeMaster  (AttributeName, LoginID, Logdate,Dis,Validation,Dailogue1,Dailogue2,Dailogue3) Output Inserted.AID VALUES ('" +
      this.state.fldname +
      "'," +
      this.state.loginId +
      ",cast(getdate() as date),0,'" +
      this.state.val +
      "','" +
      this.state.discription1 +
      "','" +
      this.state.discription2 +
      "','" +
      this.state.discription3 +
      "')";
    let response = await getDataTable(Query);
    //console.log(data);
    let res = response;
    if (res[0].AID) {
      if (this.state.options.length > 0 && this.state.val === "option") {
        for (let i = 0; i < this.state.options.length; i++) {
          let que1 =
            "INSERT INTO optionValue (AtrributeID, OptValue, logid, logdate) output inserted.OptValue VALUES (" +
            res[0].AID +
            ",'" +
            this.state.options[i].name +
            "'," +
            this.state.loginId +
            ",cast(getdate() as date))";
          let rs1 = getDataTable(que1);
          console.log(rs1);
        }
      }
      if (this.state.Pid.length > 0) {
        let Que3 =
          "Delete from AttributeParentDetails where AttributeID = " +
          res[0].AID;
        let rs3 = await getDataTable(Que3);
        for (let i = 0; i < this.state.Pid.length; i++) {
          let que2 =
            "INSERT INTO AttributeParentDetails (AttributeID, ParentID, LoginID, LogDate) output inserted.APID VALUES (" +
            res[0].AID +
            "," +
            this.state.Pid[i].DisplayId +
            "," +
            this.state.loginId +
            ",cast(getdate() as date))";
          let rs2 = getDataTable(que2);
          console.log(rs2);
        }
      }
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Successfully Saved",
        showConfirmButton: false,
        timer: 1500,
      });
      this.setState({
        fldname: "",
        discription1: "",
        discription2: "",
        discription3: "",
        Pid: [],
        loading: false,
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Attribute Not Saved",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // console.log(OrderL = dataist);
    await this.getdata(this);
    this.forceUpdate();
  }
  render() {
    return (
      <div className="content-wrapper">
        <div
          className="loader"
          style={{ display: this.state.loading ? "block" : "none" }}
        >
          <div className="loader-item">
            <Spin />
          </div>
        </div>
        <section className="content">
          <div
            id="ctl00_CPHMaincontent_divclient"
            className="box box-success"
            style={{ marginTop: "-13px" }}
          >
            <div className="box-header with-border">
              <h3 className="box-title">
                Attribute Master
                <span
                  id="ctl00_CPHMaincontent_DivOrdNo"
                  style={{ display: "inline" }}
                ></span>
              </h3>
              <div className="pull-right">
                <MAP width="800px" logid={this.state.loginId} />
              </div>
            </div>
            <div
              className="box-body"
              id="orderDetails"
              style={{ display: "block" }}
            >
              <div className="row">
                <div className="col-xs-6 col-sm-6 col-md-2 margintop">
                  <label>Add New Attribute</label>
                  <span className="vcode">*</span>
                  <div className="form-group">
                    <input
                      name="fldname"
                      id="tp1"
                      value={this.state.fldname}
                      defaultValue={this.state.fldname}
                      onChange={this.myChangeHandler}
                      autocomplete="off"
                      placeholder="Enter FieldName"
                      tabIndex={1}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-2 margintop">
                  <label>Value Type</label>
                  <span className="vcode">*</span>
                  <div className="form-group">
                    <select
                      name="val"
                      onChange={this.myChangeHandler}
                      id="val"
                      tabIndex={1}
                      className="form-control"
                    >
                      <option selected="true" disabled="disabled">
                        Value Type
                      </option>
                      <option value="number">Numeric</option>
                      <option value="Alpha-numeric">Alpha Numeric</option>
                      <option value="date">Date</option>
                      <option value="option">Option</option>
                      <option value="yes/no">yes/no</option>
                      <option value="url">URL</option>
                    </select>
                  </div>
                </div>
                <div
                  className="col-xs-6 col-sm-6 col-md-3 margintop"
                  style={{
                    display: this.state.val === "option" ? "none" : "none",
                  }}
                >
                  {/* <label>&nbsp;</label> */}

                  {/*  <div className="form-group">
                 <MultipleDataNoparent
                      attributename="Options"
                      data={this.state.options}
                  />
                  </div>*/}
                </div>

                <div className="col-xs-4 col-sm-4 col-md-2 margintop">
                  <label>Description 1</label>
                  <div className="form-group">
                    <input
                      onChange={this.myChangeHandler}
                      value={this.state.discription1}
                      defaultValue={this.state.discription1}
                      name="discription1"
                      autoComplete="off"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-xs-4 col-sm-4 col-md-2 margintop">
                  <label>Description 2</label>
                  <div className="form-group">
                    <input
                      onChange={this.myChangeHandler}
                      value={this.state.discription2}
                      defaultValue={this.state.discription2}
                      name="discription2"
                      autoComplete="off"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-xs-4 col-sm-4 col-md-2 margintop">
                  <label>Description 3</label>
                  <div className="form-group">
                    <input
                      onChange={this.myChangeHandler}
                      value={this.state.discription3}
                      defaultValue={this.state.discription3}
                      name="discription3"
                      autoComplete="off"
                      className="form-control"
                    />
                  </div>
                </div>
                {/*<div className="col-xs-6 col-sm-6 col-md-5 margintop">
                                    <label>Select Parent</label>
                                    <AutoCompletemulti
                                        id="portalID"
                                        frmNm="FRMVALUEALIASING"
                                        quryNm="FILLATTRIBUTE"
                                        db="IMAGEDB"
                                        placeholder="Please Select Attribute"
                                        onAfterSelect={(e) => this.onAutoCOmpletMultiPleSelect(e, "Pid")}
                                        isValid={this.state.isValid}
                                        defauldVal={this.state.Pid}
                                    ></AutoCompletemulti>
        </div>*/}

                <div className="col-xs-6 col-sm-6 col-md-2 margintop">
                  <label>Attribute Group</label>
                  {/* <span className="vcode">*</span> */}
                  <div className="form-group">
                    <select
                      name="val"
                      onChange={this.myChangeHandler}
                      id="val"
                      tabIndex={1}
                      className="form-control"
                    >
                      <option selected="true" disabled="disabled">
                        Groups
                      </option>
                      <option value="Alpha-numeric">1</option>
                      <option value="Alpha-numeric">2</option>
                      <option value="Alpha-numeric">3</option>
                      <option value="Alpha-numeric">4</option>
                      <option value="Alpha-numeric">5</option>
                      <option value="Alpha-numeric">6</option>
                    </select>
                  </div>
                </div>

                <div
                  className="col-xs-6 col-sm-6 col-md-2 margintop"
                  style={{ display: this.state.updateData ? "none" : "block" }}
                >
                  <label>&nbsp;</label>
                  <div className="form-group">
                    <input
                      type="button"
                      value="Save Field"
                      onClick={this.SavePortal.bind(this)}
                      className="btn btn-primary"
                    />
                  </div>
                </div>

                <div
                  className="col-xs-6 col-sm-6 col-md-2 margintop"
                  onClick={this.UpdateAttribute.bind(this)}
                  style={{ display: this.state.updateData ? "block" : "none" }}
                >
                  <label>&nbsp;</label>
                  <div className="form-group">
                    <input
                      type="button"
                      value="Update Field"
                      className="btn btn-success"
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 margintop">
                  {
                    this.state.fielddata != undefined &&
                      this.state.fielddata.length > 0 && (
                        <AntD
                          data={[...this.state.fielddata]}
                          exportXL="true"
                          Delete="true"
                          DeleteFn={(e) => this.deleteRow(e)}
                          EditRow="true"
                          EditRowFn={(e) => this.EditRow(e)}
                        ></AntD>
                      )

                    // <Table
                    //     //GetRow='true'
                    //     //GetRowFn={(e) => this.getRowData(e)}
                    //     deleteRow1="YES"
                    //     DeleteRowFn={(e) => this.deleteRow(e)}
                    //     EditRow="true"
                    //     EditRowFn={(e) => this.EditRow(e)}
                    //     height='72vh'
                    //     data={this.state.fielddata}
                    //     id='fielddata'
                    //     exportXL="true">
                    // </Table>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  async deleteRow(e) {
    console.log(e);
    if (this.state.loginId === "1" || this.state.loginId === "10") {
      let st = window.confirm("Are you sure want to delete ?");
      if (!st) {
        return false;
      }
      this.setState({ loading: true });
      console.log(e);
      let Que =
        "Update AttributeMaster set Dis = 1 output inserted.AID where AttributeName = '" +
        e.AttributeName +
        "' and Validation='" +
        e["Value type"] +
        "'";
      let rs = await getDataTable(Que);
      if (rs.length > 0) {
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Successfully Deleted",
          showConfirmButton: false,
          timer: 1500,
        });
        await this.getdata();
      } else {
        alert("Some Error Occurred");
        this.setState({ loading: false });
      }
    } else {
      alert("Only admin allow to delete Attribute");
      return;
    }
  }
  async EditRow(e) {
    this.setState({ loading: true });
    if (this.state.loginId === "1" || this.state.loginId === "10") {
      let dt = [];

      document.getElementById("val").value = e["Value type"];
      if (e["Value type"] === "option") {
        dt = await getDataTable(
          "SELECT DISTINCT OptValue as name FROM optionValue WHERE (AtrributeID = " +
            e["#AID"] +
            ")"
        );
        if (!dt) {
          dt = [];
        }
      }
      let dt1 = await getDataTable(
        "SELECT AttributeParentDetails.ParentID AS DisplayId, AttributeMaster.AttributeName AS DisplayName FROM AttributeParentDetails INNER JOIN AttributeMaster ON AttributeParentDetails.ParentID = AttributeMaster.AID WHERE (AttributeParentDetails.AttributeID = " +
          e["#AID"] +
          ")"
      );
      if (!dt1) {
        dt1 = [];
      }
      this.setState({
        val: e["Value type"],
        fldname: e.AttributeName,
        options: dt,
        updateData: true,
        updateid: e["#AID"],
        discription1: e.Discription1,
        discription2: e.Discription2,
        discription3: e.Discription3,
        Pid: dt1,
      });
      this.setState({ loading: false });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Only Admin Can edit Attribute",
        showConfirmButton: false,
        timer: 1500,
      });
      this.setState({ loading: false });
      return false;
    }
  }
  async UpdateAttribute() {
    this.setState({ loading: true });
    let rs0 = [];
    let que0 =
      "SELECT AID FROM AttributeMaster WHERE (AttributeName = N'" +
      this.state.fldname +
      "') and dis = 0 and AID not in (" +
      this.state.updateid +
      ")";
    rs0 = await getDataTable(que0);
    debugger;
    if (rs0.length > 0) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Attribute Name Already Used",
        showConfirmButton: false,
        timer: 1500,
      });
      this.setState({ loading: false });
      return false;
    }
    let Que =
      "UPDATE AttributeMaster SET AttributeName ='" +
      this.state.fldname +
      "', Validation = '" +
      this.state.val +
      "' ,Dailogue1= '" +
      this.state.discription1 +
      "' ,Dailogue2= '" +
      this.state.discription2 +
      "' ,Dailogue3= '" +
      this.state.discription3 +
      "' output inserted.AID where AID = " +
      this.state.updateid;
    let rs = await getDataTable(Que);
    if (rs.length > 0) {
      if (this.state.options.length > 0 && this.state.val === "option") {
        for (let i = 0; i < this.state.options.length; i++) {
          let que10 =
            "Select * FROM optionValue WHERE  (AtrributeID = " +
            rs[0].AID +
            ") and OptValue = '" +
            this.state.options[i].name +
            "'";
          let rs10 = await getDataTable(que10);
          if (rs10.length <= 0) {
            let que1 =
              "INSERT INTO optionValue (AtrributeID, OptValue, logid, logdate) output inserted.OptValue VALUES (" +
              rs[0].AID +
              ",'" +
              this.state.options[i].name +
              "'," +
              this.state.loginId +
              ",cast(getdate() as date))";
            let rs1 = getDataTable(que1);
            console.log(rs1);
          }
        }
      }
      if (this.state.Pid.length > 0) {
        let Que3 =
          "Delete from AttributeParentDetails where AttributeID = " + rs[0].AID;
        let rs3 = await getDataTable(Que3);
        for (let i = 0; i < this.state.Pid.length; i++) {
          let que2 =
            "INSERT INTO AttributeParentDetails (AttributeID, ParentID, LoginID, LogDate) output inserted.APID VALUES (" +
            rs[0].AID +
            "," +
            this.state.Pid[i].DisplayId +
            "," +
            this.state.loginId +
            ",cast(getdate() as date))";
          let rs2 = getDataTable(que2);
          console.log(rs2);
        }
      }
    }
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Value Updated",
      showConfirmButton: false,
      timer: 1500,
    });
    this.setState({ loading: false });
    await this.getdata();
  }
  async getRowData(e) {
    if (this.state.loginId === "10" || this.state.loginId === "1") {
      let rsst = await getDataTable(
        "SELECT AttributAlias.aliasName, AttributeMaster.AttributeName, Portals.PortalName FROM AttributAlias INNER JOIN AttributeMaster ON AttributAlias.AttributeID = AttributeMaster.AID INNER JOIN Portals ON AttributAlias.PortalID = Portals.PID WHERE (AttributeMaster.AttributeName = '" +
          e.AttributeName +
          "')"
      );
      if (Array.isArray(rsst)) {
        Modal.info({
          title: "Aliasing Details",
          okText: "CLOSE",
          width: "600px",
          closable: true,
          footer: null,
          bodyStyle: { maxHeight: "500px" },
          style: { padding: "0px" },
          centered: true,
          maskClosable: true,
          content: (
            <div>
              <ul>
                {rsst.map((value, index) => {
                  return (
                    <li id={index}>
                      <b>{value.AttributeName}</b>-{value.aliasName}-
                      {value.PortalName}
                    </li>
                  );
                })}
              </ul>
            </div>
          ),
        });
      } else {
        return;
      }
    } else {
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Not Allowed to Show Details",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
