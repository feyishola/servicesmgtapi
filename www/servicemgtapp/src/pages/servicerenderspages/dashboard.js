import { Box, Grid } from "@mui/material";
import React from "react";
import StatsCard, { ComplexStatisticsCard } from "../../components/statscard"; // Make sure to provide the correct path to StatsCard component
import ChartCard from "../../components/chartcard"; // Make sure to provide the correct path to ChartCard component
import HomeIcon from "@mui/icons-material/Home";
import ReportsBarChart from "../../components/ReportsBarChart";
import reportsBarChartData from "../../components/ReportsBarChart/reportsBarChartData";
import ReportsLineChart from "../../components/LineCharts/ReportsLineChart";
import reportsLineChartData from "../../components/LineCharts/ReportsLineChart/reportsLineChartData";
import GradeIcon from "@mui/icons-material/Grade";
import WeekendIcon from "@mui/icons-material/Weekend";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HailIcon from "@mui/icons-material/Hail";
import EmailIcon from "@mui/icons-material/Email";
import ReactTable from "../../components/table/table";

export const SRDashboard = () => {
  const { sales, tasks } = reportsLineChartData;
  return (
    <Box sx={{ backgroundColor: "#f0f2f5", height: "100vh" }}>
      <Box mb={3} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <ComplexStatisticsCard
            color="success"
            bgcolor={"#42424a"}
            icon={<WeekendIcon fontSize="medium" style={{ color: "white" }} />}
            title="Bookings"
            count={281}
            percentage={{
              color: "success",
              amount: "+55%",
              label: "than lask week",
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <ComplexStatisticsCard
            color="success"
            bgcolor={"#49a3f1"}
            icon={<EmailIcon style={{ color: "white" }} />}
            title="Messages"
            count={281}
            percentage={{
              color: "success",
              amount: "+55%",
              label: "than lask week",
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <ComplexStatisticsCard
            color="success"
            bgcolor={"#66BB6A"}
            icon={<HailIcon style={{ color: "white" }} />}
            title="Referrals"
            count={281}
            percentage={{
              color: "success",
              amount: "+55%",
              label: "than lask week",
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <ComplexStatisticsCard
            color="success"
            bgcolor={"#EC407A"}
            icon={<GradeIcon style={{ color: "white" }} />}
            title="Ratings"
            count={281}
            percentage={{
              color: "success",
              amount: "+55%",
              label: "than lask week",
            }}
          />
        </Grid>
      </Grid>
      <Box mt={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <ReportsBarChart
              color="info"
              bgColor={"#49a3f1"}
              title="website views"
              description="Weekly website views"
              date="3rd week July"
              chart={reportsBarChartData}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ReportsLineChart
              // color="success"
              bgColor={"#66BB6A"}
              title="daily sales"
              description={
                <>
                  (<strong>+15%</strong>) increase in today sales.
                </>
              }
              date="updated 4 min ago"
              chart={sales}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ReportsLineChart
              bgColor={"#42424a"}
              title="Yearly reviews"
              description="Last Campaign Performance"
              date="just updated"
              chart={tasks}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={12} lg={12}>
            <ReactTable />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
