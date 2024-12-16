import React, { useEffect, useState } from "react";
import ThemeDash from "../Compnents/ThemeDash";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Switch, TableCell, CircularProgress } from "@mui/material";
import TextField from "../Compnents/TextField";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import TableComponent from "../Compnents/TableComponent";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';

const Category = () => {
  const token = localStorage.getItem("token");
  const [category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eid, setEid] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);  

  const TableHeader = ["Index", "Category Name", "Status", "Delete", "Update"];

  const formik = useFormik({
    initialValues: { catagoryName: "" },
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);  
        const url = eid
          ? `https://interviewhub-3ro7.onrender.com/catagory/${eid}`
          : "https://interviewhub-3ro7.onrender.com/catagory/create";
        const method = eid ? "patch" : "post";

        const res = await axios[method](url, values, {
          headers: { Authorization: token },
        });

        toast.success(res.data.message);
        resetForm();
        setEid(null);
        handleClose();
        dataFetch();
      } catch (error) {
        toast.error("An error occurred while processing your request.");
        console.error(error);
      } finally {
        setLoading(false);  
      }
    },
  });

  const dataFetch = async () => {
    try {
      setLoading(true);  
      const res = await axios.get("https://interviewhub-3ro7.onrender.com/catagory/", {
        headers: { Authorization: token },
      });
      setCategory(res.data.data);
      setFilteredCategory(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
      console.error(error);
    } finally {
      setLoading(false);  
    }
  };

  const updateData = (id) => {
    const selectedData = category.find((item) => item._id === id);
    setEid(id);
    formik.setValues(selectedData);
    setOpen(true);
  };

  const switchToggle = async (id) => {
    const selectedData = category.find((item) => item._id === id);
    const updatedStatus = selectedData.status === "on" ? "off" : "on";

    try {
      setLoading(true);  
      await axios.patch(
        `https://interviewhub-3ro7.onrender.com/catagory/${id}`,
        { status: updatedStatus },
        { headers: { Authorization: token } }
      );
      dataFetch();
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    } finally {
      setLoading(false);  
    }
  };

  const deleteData = async (id) => {
    try {
      setLoading(true);  
      const res = await axios.delete(`https://interviewhub-3ro7.onrender.com/catagory/${id}`, {
        headers: { Authorization: token },
      });
      toast.success(res.data.message);
      dataFetch();
    } catch (error) {
      toast.error("Failed to delete category.");
      console.error(error);
    } finally {
      setLoading(false);  
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = category.filter((cat) =>
      cat.catagoryName.toLowerCase().includes(term)
    );
    setFilteredCategory(filtered);
  };

  useEffect(() => {
    dataFetch();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setEid(null);
    formik.resetForm();
  };

  return (
    <ThemeDash>
      <Box className="mb-2">
        <React.Fragment>
          <Box className="gap-2 d-flex justify-content-between align-items-center">
            <Box sx={{ width: "85%" }}>
              <TextField label="Search Category" value={searchTerm} onChange={handleSearch} />
            </Box>
            <Box sx={{ width: "15%" }}>
              <Button variant="contained" onClick={() => { setOpen(true) }} className="w-100 py-3">
                ADD CATEGORY
              </Button>
            </Box>
          </Box>
        </React.Fragment>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          <TableComponent
            TableHeader={TableHeader}
            TableData={filteredCategory}
            renderRow={(row, index) => (
              <>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.catagoryName}</TableCell>
                <TableCell>
                  <Switch
                    checked={row.status === "on"}
                    onClick={() => switchToggle(row._id)}
                  />
                </TableCell>
                <TableCell>
                  <Button color="white" onClick={() => deleteData(row._id)}>
                    <DeleteRoundedIcon className="text-danger" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button color="white" onClick={() => updateData(row._id)}>
                    <BorderColorRoundedIcon className="text-success" />
                  </Button>
                </TableCell>
              </>
            )}
          />
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{eid ? "Update Category" : "Add Category"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="Category Name"
              name="catagoryName"
              onChange={formik.handleChange}
              value={formik.values.catagoryName}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">
              {eid ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ToastContainer />
    </ThemeDash>
  );
};

export default Category;
