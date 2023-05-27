import { shallowReactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";
import axios from "axios";

const axoisInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: { "X-Requested-With": "XMLHttpRequest",   'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true,
});

export default function useMenu() {
  const state = shallowReactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
  });

  const columns = [
    {
      name: "sl",
      label: "#",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: false,
    },
    {
      name: "slug",
      label: "Slug",
      required: true,
      field: (row) => row.slug,
      align: "left",
      sortable: true,
    },
    {
      name: "type",
      label: "type",
      required: true,
      field: (row) => row.type?.name,
      align: "left",
      sortable: true,
    },
    {
      name: "group",
      label: "group",
      required: true,
      field: (row) => row.group?.name,
      align: "left",
      sortable: true,
    },
    {
      name: "title",
      label: "title",
      required: true,
      field: (row) => row.title,
      align: "left",
      sortable: true,
    },
    {
      name: "status",
      label: "Status",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },
    {
      name: "actions",
      label: "ACTIONS",
      required: true,
      field: (row) => row,
      align: "center",
    },
  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/menus", data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const update = async (id, data) => {
    try {
      state.saving = true;
      await api.patch(`/menus/${id}`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const trash = async (id) => {
    try {
      state.deleting = true;
      await api.delete(`/menus/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const getUsing = async (id) => {
    try {
      const response = await api.get(`/menus/using/${id}`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/menus/${id}`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const paginate = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    try {
      const response = await api.get("/menus/paginate", { params });
      state.items = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const all = async () => {
    try {
      const response = await api.get("/menus/all");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getType = async () => {
    try {
      const response = await api.get("/menus/type/all");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getGroup = async () => {
    try {
      const response = await api.get("/menus/group/all");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const addType = async (data) => {
    try {
      state.saving = true;
      await api.post("/menus/type", data);
    } catch (err) {
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const addGroup = async (data) => {
    try {
      state.saving = true;
      await api.post("/menus/group", data);
    } catch (err) {
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };
  const updateType = async (id, data) => {
    try {
      state.saving = true;
      await api.patch(`/menus/type/${id}`, data);
    } catch (err) {
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const updateGroup = async (id, data) => {
    try {
      state.saving = true;
      await api.patch(`/menus/group/${id}`, data);
    } catch (err) {
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  return {
    ...toRefs(state),
    columns,
    add,
    update,
    trash,
    get,
    paginate,
    all,
    getUsing,
    getType,
    getGroup,
    addType,
    updateType,
    updateGroup,
    addGroup
  };
}
