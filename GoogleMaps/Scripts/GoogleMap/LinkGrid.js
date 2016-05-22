var LinkGrid = {
    BaseUrl: null,
    Init: function (baseUrl) {
        LinkGrid.BaseUrl = baseUrl;
        LinkGrid.SetGrid();
        $("#gbox_jqGrid").css("width", $("#gbox_jqGrid").width() - 12)
    },

    SetGrid: function () {
        $("#jqGrid").jqGrid({
            url: LinkGrid.BaseUrl + "/GetCultureIconList",
            datatype: "json",
            styleUI: 'Bootstrap',
            colModel: [
                    { label: 'Культура', name: 'CultureName', width: 150 },
                    { label: 'Ссылка на картинку', name: 'CultureIconLinl', width: 650, editable: true, keys: true },
            ],
            rowNum: 10,
            height: 250,
            onSelectRow: function (rowId) {
                var $self = $(this), savedRows = $self.jqGrid("getGridParam", "savedRow");
                var currentLink = $self.jqGrid("getCell", rowId, "CultureIconLinl");
                if (savedRows.length > 0) {
                    $self.jqGrid("restoreRow", savedRows[0].id);
                }
                LinkGrid.ShowImage(currentLink);
            },
            ondblClickRow: function (rowid) {
                var $self = $(this), savedRows = $self.jqGrid("getGridParam", "savedRow");
                var currentLink = $self.jqGrid("getCell", rowid, "CultureIconLinl");
                LinkGrid.ShowImage(currentLink);
                if (savedRows.length > 0) {
                    $self.jqGrid("restoreRow", savedRows[0].id);
                }
                $self.jqGrid("editRow", rowid, {
                    keys: true,
                    aftersavefunc: function (rowid) {
                        var $this = $(this);
                        var rowObject = $this.jqGrid("getGridParam", "datatype") === "local" ? this.jqGrid("getLocalRow", rowid) :
                        {
                            CultureName: $this.jqGrid("getCell", rowid, "CultureName"),
                            CultureIconLinl: $this.jqGrid("getCell", rowid, "CultureIconLinl")
                        };
                        $this.jqGrid("setRowData", rowid, {
                            CultureName: rowObject.CultureName,
                            CultureIconLinl: rowObject.CultureIconLinl,
                        });

                        $.ajax({
                            url: LinkGrid.BaseUrl + "/AddEditLink",
                            data: { cultureId: rowid, value: rowObject.CultureIconLinl },
                            success: function (response) {
                                GoogleActions.ShowNoty('Данные обновлены', 'success')
                            },
                            error: function () {
                                GoogleActions.ShowNoty('Произошла ошибка', 'error')
                            }
                        })
                    }
                });
            }
        });
    },

    ShowImage: function (link) {
        $("#imgCulture").attr("src", link == null ? "" : link);
        $("#imgCulture").show();
    },
}