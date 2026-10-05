import { useEffect, useState } from "react";
import { getAuditLogs } from "../../api/auditLogApi";
import Pagination from "../Pagination/Pagination";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [actionFilter, setActionFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response =
        await getAuditLogs();

      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredLogs = logs.filter(
    (log) => {
      const matchesSearch =
        log.action
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        log.details
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        `${log.performedBy?.firstName || ""
        } ${log.performedBy?.lastName || ""
        }`
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesFilter =
        actionFilter === "All" ||
        log.action === actionFilter;

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  const lastIndex =
    currentPage * itemsPerPage;

  const firstIndex =
    lastIndex - itemsPerPage;

  const currentLogs =
    filteredLogs.slice(
      firstIndex,
      lastIndex
    );

  const totalPages = Math.ceil(
    filteredLogs.length /
      itemsPerPage
  );

  const actionOptions = [
    "All",
    ...new Set(
      logs.map((log) => log.action)
    ),
  ];

  return (
    <div className="admin-section">
      <h3>Audit Logs</h3>

      <div
        className="table-toolbar"
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: "10px",
          marginBottom: "15px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search audit logs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(
              e.target.value
            );
            setCurrentPage(1);
          }}
          className="search-box"
        />

        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(
              e.target.value
            );
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          {actionOptions.map(
            (action) => (
              <option
                key={action}
                value={action}
              >
                {action}
              </option>
            )
          )}
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <p className="empty-state">
          No audit logs found.
        </p>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Performed By</th>
                <th>Details</th>
                <th>Date & Time</th>
              </tr>
            </thead>

            <tbody>
              {currentLogs.map((log) => (
                <tr key={log._id}>
                  <td>{log.action}</td>

                  <td>
                    {log.performedBy
                      ? `${log.performedBy.firstName} ${log.performedBy.lastName}`
                      : "Unknown"}
                  </td>

                  <td>
                    {log.details}
                  </td>

                  <td>
                    {new Date(
                      log.createdAt
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginTop: "15px",
              borderTop:
                "1px solid #e0e0e0",
              paddingTop: "15px",
            }}
          >
            <div>
              <label>Show </label>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(
                    Number(
                      e.target.value
                    )
                  );
                  setCurrentPage(1);
                }}
              >
                <option value={5}>
                  5
                </option>
                <option value={10}>
                  10
                </option>
                <option value={15}>
                  15
                </option>
                <option value={20}>
                  20
                </option>
              </select>

              <span> entries</span>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                setCurrentPage={
                  setCurrentPage
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AuditLogs;