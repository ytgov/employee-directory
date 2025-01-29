import { syncLocaleWithRoute } from "@/utils/localeUtils.js";

export default {
  data() {
    return {
      breadcrumbsList: [],
    };
  },
  methods: {
    async updateBreadCrumbs() {
      await syncLocaleWithRoute(this);
      let locale = this.$i18n.locale || "en";
      let breadcrumbs = [...(this.$route.meta.breadcrumb || [])];
      breadcrumbs.forEach((item) => {

        const departmentSlug = this.department ? this.department.replace(/\s/g, "-") : "";
        const divisionSlug = this.division
        ? this.division === "Not division"
          ? this.division.toLowerCase().replace(/\s/g, "-")
          : this.division.replace(/\s/g, "-")
        : "";

        const branchSlug = this.branch
        ? this.branch === "Not branch"
          ? this.branch.toLowerCase().replace(/\s/g, "-")
          : this.branch.replace(/\s/g, "-")
        : "";

        //const branchSlug = this.branch ? this.branch.replace(/\s/g, "-") : "";

        switch (item.name) {
            case "breadcrumbs.department":
                item.name = (this.department || "").trim();
                item.link = `/${locale}/find-employee/${departmentSlug.replace(/\s/g, "-")}`;
                break;
            case "breadcrumbs.division":
                item.name = (this.division || "").trim();
                item.link = `/${locale}/find-employee/${departmentSlug.replace(/\s/g, "-")}/${divisionSlug.replace(/\s/g, "-")}`;
                 if(this.division === 'Not division'){
                  item.link += "/not-branch";
                }else if (this.branch !== "All branches"){
                  item.link += "/all-branches";
                }
                break;
            case "breadcrumbs.branch":
                item.name = this.branch === "All branches" ? "All branches" : (this.branch || "").trim();
                item.link =`/${locale}/find-employee/${departmentSlug.replace(/\s/g, "-")}/${divisionSlug.replace(/\s/g, "-")}/${branchSlug.replace(/\s/g, "-")}`;
                break;
            case "breadcrumbs.username":
                item.name = this.title || "";
                break;
        }
      });

      this.breadcrumbsList = breadcrumbs.map((item) => ({
        ...item,
        link: item.link
        ? item.link.replace(/:locale/g, locale) 
                  .replace(/^\/[a-z]{2}\//, `/${locale}/`) 
        : null
      }));
      this.breadcrumbsList = this.breadcrumbsList.filter((item) => item.name !== null && item.name !== '');
    },
  },
  computed: {
    departmentName() {
      return this.department ? this.department.trim() : "";
    },
    departmentSlug() {
      return this.department ? this.department.trim().replace(/\s/g, "-") : "";
    },
    divisionName() {
      return this.division ? this.division.trim() : "";
    },
    divisionSlug() {
      return this.division ? this.division.trim().replace(/\s/g, "-") : "";
    },
    branchName() {
      return this.branch ? this.branch.trim() : "All branches";
    },
    username() {
      return this.title || "";
    },
  },
};