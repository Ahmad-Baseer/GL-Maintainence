/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['../accUtils', 'knockout', 'require', 'exports', 'ojs/ojbootstrap',
  'ojs/ojknockout', 'ojs/ojaccordion', 'ojs/ojradioset', 'ojs/ojlabel',
  'oj-c/input-number', 'oj-c/input-text', 'oj-c/form-layout',
  'ojs/ojmessaging', 'ojs/ojselectcombobox', 'oj-c/button', 'ojs/ojformlayout'],
  function (accUtils, ko) {
    function DashboardViewModel() {

      // Observables
      this.glId = ko.observable(null);
      this.glDescription = ko.observable(null);
      this.glType = ko.observable(null);

      this.connected = () => {
        accUtils.announce('GL page loaded.', 'assertive');
        document.title = "General Ledger";
      };

      this.handleSave = async (event) => {
        try {
          const payload = {
            gl_number: this.glId(),
            gl_type: this.glType(),
            gl_description: this.glDescription()
          };

          console.log("Sending data to API:", payload);

          const response = await fetch("http://localhost:8080/api/gLedger", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const result = await response.text();
          alert("✅ Saved Successfully!\n\nResponse: " + result);

        } catch (error) {
          console.error("Error while saving:", error);
          alert("❌ Failed to save.\n\n" + error.message);
        }
      };

      this.handleGet = (event) => {
        const id = this.glId();
        if (!id) {
          alert("Please enter GL ID to fetch.");
          return;
        }

        fetch(`http://localhost:8080/api/gLedger/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Server returned ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Fetched GL:", data);
            this.glId(Number(data.gl_number));
            this.glDescription(data.gl_description || "");
            this.glType(data.gl_type || "");
            alert("GL fetched successfully!");
          })
          .catch((error) => {
            console.error("Error fetching GL:", error);
            alert("Failed to fetch GL. Check console for details.");
          });
      };


      this.handleDelete = (event) => {
        const id = this.glId();
        if (!id) {
          alert("Please enter GL ID to delete.");
          return;
        }

        if (!confirm(`Are you sure you want to delete GL with ID ${id}?`)) {
          return;
        }

        const payload = {
          gl_number: Number(this.glId()),
          gl_description: this.glDescription(),
          gl_type: this.glType()
        };

        fetch("http://localhost:8080/api/gLedger", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Server returned ${response.status}`);
            }
            alert("GL deleted successfully!");
            // Clear form
            this.glId(null);
            this.glDescription("");
            this.glType("");
            ko.tasks.runEarly();
          })
          .catch((error) => {
            console.error("Error deleting GL:", error);
            alert("Failed to delete GL. Check console for details.");
          });
      };


      this.handleUpdate = (event) => {
        const id = this.glId();
        if (!id) {
          alert("Please enter GL ID to update.");
          return;
        }

        const payload = {
          gl_number: Number(this.glId()),
          gl_description: this.glDescription(),
          gl_type: this.glType()
        };

        fetch("http://localhost:8080/api/gLedger", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Server returned ${response.status}`);
            }
            alert("GL updated successfully!");
          })
          .catch((error) => {
            console.error("Error updating GL:", error);
            alert("Failed to update GL. Check console for details.");
          });
      };


      this.disconnected = () => {};
      this.transitionCompleted = () => {};
    }

    return DashboardViewModel;
  }
);
