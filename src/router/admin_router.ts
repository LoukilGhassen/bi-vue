export const admin_router = {
  path: "/admin",
  name: "admin",
  meta: {
    requiresAuth: true,
    access: ["admin"],
  },
  component: () =>
    import(
      /* webpackChunkName: "adminlayout */ "@/components/layouts/mainLayout/adminLayout.vue"
    ),
  children: [
    {
      path: "userManagement",
      meta: {
        requiresAuth: true,
        webElementName: "UserManagement",
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),

    },

    // {
    //   path: "userManagement",
    //   meta: {
    //     requiresAuth: true,
    //   },
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
    //     ),
    //   children: [
    //     {
    //       path: "",
    //       name: "user-management",
    //       component: () =>
    //         import(
    //           /* webpackChunkName: "list-OffFieldActivity" */ "@/views/main/offFieldActivity/OffFieldActivityList.vue"
    //         ),
    //     }
    //   ],
    // },
    {
      path: "appconfigs",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-appconfig",
          component: () =>
            import(
              /* webpackChunkName: "list-appConfig" */ "@/views/main/appConfig/AppConfigList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-appconfig",
          component: () =>
            import(
              /* webpackChunkName: "create-appConfig" */ "@/views/main/appConfig/AppConfigCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-appconfig",
          component: () =>
            import(
              /* webpackChunkName: "edit-appConfig" */ "@/views/main/appConfig/AppConfigEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-appconfig",
          component: () =>
            import(
              /* webpackChunkName: "detail-appConfig" */ "@/views/main/appConfig/AppConfigDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-appconfig",
          component: () =>
            import(
              /* webpackChunkName: "import-data-appConfig" */ "@/views/main/appConfig/AppConfigImportData.vue"
            ),
        },
      ],
    },
    {
      path: "actors",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-actor",
          component: () =>
            import(
              /* webpackChunkName: "list-actor" */ "@/views/main/actor/ActorList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-actor",
          component: () =>
            import(
              /* webpackChunkName: "create-actor" */ "@/views/main/actor/ActorCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-actor",
          component: () =>
            import(
              /* webpackChunkName: "edit-actor" */ "@/views/main/actor/ActorEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-actor",
          component: () =>
            import(
              /* webpackChunkName: "detail-actor" */ "@/views/main/actor/ActorDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-actor",
          component: () =>
            import(
              /* webpackChunkName: "import-data-actor" */ "@/views/main/actor/ActorImportData.vue"
            ),
        },
      ],
    },
    {
      path: "actorcompanies",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-actorcompany",
          component: () =>
            import(
              /* webpackChunkName: "list-actorCompany" */ "@/views/main/actorCompany/ActorCompanyList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-actorcompany",
          component: () =>
            import(
              /* webpackChunkName: "create-actorCompany" */ "@/views/main/actorCompany/ActorCompanyCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-actorcompany",
          component: () =>
            import(
              /* webpackChunkName: "edit-actorCompany" */ "@/views/main/actorCompany/ActorCompanyEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-actorcompany",
          component: () =>
            import(
              /* webpackChunkName: "detail-actorCompany" */ "@/views/main/actorCompany/ActorCompanyDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-actorcompany",
          component: () =>
            import(
              /* webpackChunkName: "import-data-actorCompany" */ "@/views/main/actorCompany/ActorCompanyImportData.vue"
            ),
        },
      ],
    },
    {
      path: "actorpeople",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-actorperson",
          component: () =>
            import(
              /* webpackChunkName: "list-actorPerson" */ "@/views/main/actorPerson/ActorPersonList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-actorperson",
          component: () =>
            import(
              /* webpackChunkName: "create-actorPerson" */ "@/views/main/actorPerson/ActorPersonCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-actorperson",
          component: () =>
            import(
              /* webpackChunkName: "edit-actorPerson" */ "@/views/main/actorPerson/ActorPersonEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-actorperson",
          component: () =>
            import(
              /* webpackChunkName: "detail-actorPerson" */ "@/views/main/actorPerson/ActorPersonDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-actorperson",
          component: () =>
            import(
              /* webpackChunkName: "import-data-actorPerson" */ "@/views/main/actorPerson/ActorPersonImportData.vue"
            ),
        },
      ],
    },
    {
      path: "products",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-actorproduct",
          component: () =>
            import(
              /* webpackChunkName: "list-actorProduct" */ "@/views/main/actorProduct/ActorProductList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-actorproduct",
          component: () =>
            import(
              /* webpackChunkName: "create-actorProduct" */ "@/views/main/actorProduct/ActorProductModal.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-actorproduct",
          component: () =>
            import(
              /* webpackChunkName: "edit-actorProduct" */ "@/views/main/actorProduct/ActorProductEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-actorproduct",
          component: () =>
            import(
              /* webpackChunkName: "detail-actorProduct" */ "@/views/main/actorProduct/ActorProductDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-actorproduct",
          component: () =>
            import(
              /* webpackChunkName: "import-data-actorProduct" */ "@/views/main/actorProduct/ActorProductImportData.vue"
            ),
        },
      ],
    },
    {
      path: "actorrelationships",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-actorrelationship",
          component: () =>
            import(
              /* webpackChunkName: "list-actorRelationship" */ "@/views/main/actorRelationship/ActorRelationshipList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-actorrelationship",
          component: () =>
            import(
              /* webpackChunkName: "create-actorRelationship" */ "@/views/main/actorRelationship/ActorRelationshipCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-actorrelationship",
          component: () =>
            import(
              /* webpackChunkName: "edit-actorRelationship" */ "@/views/main/actorRelationship/ActorRelationshipEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-actorrelationship",
          component: () =>
            import(
              /* webpackChunkName: "detail-actorRelationship" */ "@/views/main/actorRelationship/ActorRelationshipDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-actorrelationship",
          component: () =>
            import(
              /* webpackChunkName: "import-data-actorRelationship" */ "@/views/main/actorRelationship/ActorRelationshipImportData.vue"
            ),
        },
      ],
    },
    {
      path: "actorrelationshipdefinitions",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-actorrelationshipdefinition",
          component: () =>
            import(
              /* webpackChunkName: "list-actorRelationshipDefinition" */ "@/views/main/actorRelationshipDefinition/ActorRelationshipDefinitionList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-actorrelationshipdefinition",
          component: () =>
            import(
              /* webpackChunkName: "create-actorRelationshipDefinition" */ "@/views/main/actorRelationshipDefinition/ActorRelationshipDefinitionCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-actorrelationshipdefinition",
          component: () =>
            import(
              /* webpackChunkName: "edit-actorRelationshipDefinition" */ "@/views/main/actorRelationshipDefinition/ActorRelationshipDefinitionEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-actorrelationshipdefinition",
          component: () =>
            import(
              /* webpackChunkName: "detail-actorRelationshipDefinition" */ "@/views/main/actorRelationshipDefinition/ActorRelationshipDefinitionDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-actorrelationshipdefinition",
          component: () =>
            import(
              /* webpackChunkName: "import-data-actorRelationshipDefinition" */ "@/views/main/actorRelationshipDefinition/ActorRelationshipDefinitionImportData.vue"
            ),
        },
      ],
    },
    {
      path: "actortelecoms",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-actortelecom",
          component: () =>
            import(
              /* webpackChunkName: "list-actorTelecom" */ "@/views/main/actorTelecom/ActorTelecomList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-actortelecom",
          component: () =>
            import(
              /* webpackChunkName: "create-actorTelecom" */ "@/views/main/actorTelecom/ActorTelecomCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-actortelecom",
          component: () =>
            import(
              /* webpackChunkName: "edit-actorTelecom" */ "@/views/main/actorTelecom/ActorTelecomEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-actortelecom",
          component: () =>
            import(
              /* webpackChunkName: "detail-actorTelecom" */ "@/views/main/actorTelecom/ActorTelecomDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-actortelecom",
          component: () =>
            import(
              /* webpackChunkName: "import-data-actorTelecom" */ "@/views/main/actorTelecom/ActorTelecomImportData.vue"
            ),
        },
      ],
    },
    {
      path: "actorvehicules",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-actorvehicule",
          component: () =>
            import(
              /* webpackChunkName: "list-actorVehicule" */ "@/views/main/actorVehicule/ActorVehiculeList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-actorvehicule",
          component: () =>
            import(
              /* webpackChunkName: "create-actorVehicule" */ "@/views/main/actorVehicule/ActorVehiculeCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-actorvehicule",
          component: () =>
            import(
              /* webpackChunkName: "edit-actorVehicule" */ "@/views/main/actorVehicule/ActorVehiculeEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-actorvehicule",
          component: () =>
            import(
              /* webpackChunkName: "detail-actorVehicule" */ "@/views/main/actorVehicule/ActorVehiculeDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-actorvehicule",
          component: () =>
            import(
              /* webpackChunkName: "import-data-actorVehicule" */ "@/views/main/actorVehicule/ActorVehiculeImportData.vue"
            ),
        },
      ],
    },
    {
      path: "addresses",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-address",
          component: () =>
            import(
              /* webpackChunkName: "list-address" */ "@/views/main/address/AddressList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-address",
          component: () =>
            import(
              /* webpackChunkName: "create-address" */ "@/views/main/address/AddressCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-address",
          component: () =>
            import(
              /* webpackChunkName: "edit-address" */ "@/views/main/address/AddressEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-address",
          component: () =>
            import(
              /* webpackChunkName: "detail-address" */ "@/views/main/address/AddressDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-address",
          component: () =>
            import(
              /* webpackChunkName: "import-data-address" */ "@/views/main/address/AddressImportData.vue"
            ),
        },
      ],
    },
    {
      path: "addresstypes",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-addresstype",
          component: () =>
            import(
              /* webpackChunkName: "list-addressType" */ "@/views/main/addressType/AddressTypeList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-addresstype",
          component: () =>
            import(
              /* webpackChunkName: "create-addressType" */ "@/views/main/addressType/AddressTypeCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-addresstype",
          component: () =>
            import(
              /* webpackChunkName: "edit-addressType" */ "@/views/main/addressType/AddressTypeEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-addresstype",
          component: () =>
            import(
              /* webpackChunkName: "detail-addressType" */ "@/views/main/addressType/AddressTypeDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-addresstype",
          component: () =>
            import(
              /* webpackChunkName: "import-data-addressType" */ "@/views/main/addressType/AddressTypeImportData.vue"
            ),
        },
      ],
    },
    {
      path: "bisounourshes",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-bisounoursh",
          component: () =>
            import(
              /* webpackChunkName: "list-bisounoursH" */ "@/views/main/bisounoursH/BisounoursHList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-bisounoursh",
          component: () =>
            import(
              /* webpackChunkName: "create-bisounoursH" */ "@/views/main/bisounoursH/BisounoursHCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-bisounoursh",
          component: () =>
            import(
              /* webpackChunkName: "edit-bisounoursH" */ "@/views/main/bisounoursH/BisounoursHEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-bisounoursh",
          component: () =>
            import(
              /* webpackChunkName: "detail-bisounoursH" */ "@/views/main/bisounoursH/BisounoursHDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-bisounoursh",
          component: () =>
            import(
              /* webpackChunkName: "import-data-bisounoursH" */ "@/views/main/bisounoursH/BisounoursHImportData.vue"
            ),
        },
      ],
    },
    {
      path: "bisounousjroles",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-bisounousjrole",
          component: () =>
            import(
              /* webpackChunkName: "list-bisounousJRole" */ "@/views/main/bisounousJRole/BisounousJRoleList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-bisounousjrole",
          component: () =>
            import(
              /* webpackChunkName: "create-bisounousJRole" */ "@/views/main/bisounousJRole/BisounousJRoleCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-bisounousjrole",
          component: () =>
            import(
              /* webpackChunkName: "edit-bisounousJRole" */ "@/views/main/bisounousJRole/BisounousJRoleEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-bisounousjrole",
          component: () =>
            import(
              /* webpackChunkName: "detail-bisounousJRole" */ "@/views/main/bisounousJRole/BisounousJRoleDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-bisounousjrole",
          component: () =>
            import(
              /* webpackChunkName: "import-data-bisounousJRole" */ "@/views/main/bisounousJRole/BisounousJRoleImportData.vue"
            ),
        },
      ],
    },
    {
      path: "bisousnours",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-bisousnour",
          component: () =>
            import(
              /* webpackChunkName: "list-bisousnour" */ "@/views/main/bisousnour/BisousnourList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-bisousnour",
          component: () =>
            import(
              /* webpackChunkName: "create-bisousnour" */ "@/views/main/bisousnour/BisousnourCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-bisousnour",
          component: () =>
            import(
              /* webpackChunkName: "edit-bisousnour" */ "@/views/main/bisousnour/BisousnourEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-bisousnour",
          component: () =>
            import(
              /* webpackChunkName: "detail-bisousnour" */ "@/views/main/bisousnour/BisousnourDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-bisousnour",
          component: () =>
            import(
              /* webpackChunkName: "import-data-bisousnour" */ "@/views/main/bisousnour/BisousnourImportData.vue"
            ),
        },
      ],
    },
    {
      path: "ids",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-ids",
          component: () =>
            import(
              /* webpackChunkName: "list-ids" */ "@/views/main/ids/IdsList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-ids",
          component: () =>
            import(
              /* webpackChunkName: "create-ids" */ "@/views/main/ids/IdsCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-ids",
          component: () =>
            import(
              /* webpackChunkName: "edit-ids" */ "@/views/main/ids/IdsEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-ids",
          component: () =>
            import(
              /* webpackChunkName: "detail-ids" */ "@/views/main/ids/IdsDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-ids",
          component: () =>
            import(
              /* webpackChunkName: "import-data-ids" */ "@/views/main/ids/IdsImportData.vue"
            ),
        },
      ],
    },
    {
      path: "listtypes",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-listtype",
          component: () =>
            import(
              /* webpackChunkName: "list-listType" */ "@/views/main/listType/ListTypeList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-listtype",
          component: () =>
            import(
              /* webpackChunkName: "create-listType" */ "@/views/main/listType/ListTypeCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-listtype",
          component: () =>
            import(
              /* webpackChunkName: "edit-listType" */ "@/views/main/listType/ListTypeEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-listtype",
          component: () =>
            import(
              /* webpackChunkName: "detail-listType" */ "@/views/main/listType/ListTypeDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-listtype",
          component: () =>
            import(
              /* webpackChunkName: "import-data-listType" */ "@/views/main/listType/ListTypeImportData.vue"
            ),
        },
      ],
    },
    {
      path: "lists",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-list",
          component: () =>
            import(
              /* webpackChunkName: "list-list" */ "@/views/main/list/ListList.vue"
            ),
        },
    
        {
          path: "offFieald",
          name: "admin-list-offFiealdActivityList",
          component: () =>
            import(
              /* webpackChunkName: "list-list" */ "@/views/main/list/OffFiealdList.vue"
            ),
        },

        {
          path: "deleteReasons",
          name: "admin-list-deleteReasonsList",
          component: () =>
            import(
              /* webpackChunkName: "list-list" */ "@/views/main/list/DeleteReasonsList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-list",
          component: () =>
            import(
              /* webpackChunkName: "create-list" */ "@/views/main/list/ListCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-list",
          component: () =>
            import(
              /* webpackChunkName: "edit-list" */ "@/views/main/list/ListEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-list",
          component: () =>
            import(
              /* webpackChunkName: "detail-list" */ "@/views/main/list/ListDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-list",
          component: () =>
            import(
              /* webpackChunkName: "import-data-list" */ "@/views/main/list/ListImportData.vue"
            ),
        },
      ],
    },
    {
      path: "packagings",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-packaging",
          component: () =>
            import(
              /* webpackChunkName: "list-packaging" */ "@/views/main/packaging/PackagingList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-packaging",
          component: () =>
            import(
              /* webpackChunkName: "create-packaging" */ "@/views/main/packaging/PackagingCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-packaging",
          component: () =>
            import(
              /* webpackChunkName: "edit-packaging" */ "@/views/main/packaging/PackagingEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-packaging",
          component: () =>
            import(
              /* webpackChunkName: "detail-packaging" */ "@/views/main/packaging/PackagingDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-packaging",
          component: () =>
            import(
              /* webpackChunkName: "import-data-packaging" */ "@/views/main/packaging/PackagingImportData.vue"
            ),
        },
      ],
    },
    {
      path: "packagingprices",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-packagingprice",
          component: () =>
            import(
              /* webpackChunkName: "list-packagingPrice" */ "@/views/main/packagingPrice/PackagingPriceList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-packagingprice",
          component: () =>
            import(
              /* webpackChunkName: "create-packagingPrice" */ "@/views/main/packagingPrice/PackagingPriceCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-packagingprice",
          component: () =>
            import(
              /* webpackChunkName: "edit-packagingPrice" */ "@/views/main/packagingPrice/PackagingPriceEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-packagingprice",
          component: () =>
            import(
              /* webpackChunkName: "detail-packagingPrice" */ "@/views/main/packagingPrice/PackagingPriceDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-packagingprice",
          component: () =>
            import(
              /* webpackChunkName: "import-data-packagingPrice" */ "@/views/main/packagingPrice/PackagingPriceImportData.vue"
            ),
        },
      ],
    },
    {
      path: "roles",
      meta: {
        requiresAuth: true,
        group: ["ADMIN"],
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-role",
          component: () =>
            import(
              /* webpackChunkName: "list-role" */ "@/views/main/role/RoleList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-role",
          component: () =>
            import(
              /* webpackChunkName: "create-role" */ "@/views/main/role/RoleCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-role",
          component: () =>
            import(
              /* webpackChunkName: "edit-role" */ "@/views/main/role/RoleEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-role",
          component: () =>
            import(
              /* webpackChunkName: "detail-role" */ "@/views/main/role/RoleDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-role",
          component: () =>
            import(
              /* webpackChunkName: "import-data-role" */ "@/views/main/role/RoleImportData.vue"
            ),
        },
      ],
    },
    {
      path: "rolejpages",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-rolejpage",
          component: () =>
            import(
              /* webpackChunkName: "list-roleJPage" */ "@/views/main/roleJPage/RoleJPageList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-rolejpage",
          component: () =>
            import(
              /* webpackChunkName: "create-roleJPage" */ "@/views/main/roleJPage/RoleJPageCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-rolejpage",
          component: () =>
            import(
              /* webpackChunkName: "edit-roleJPage" */ "@/views/main/roleJPage/RoleJPageEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-rolejpage",
          component: () =>
            import(
              /* webpackChunkName: "detail-roleJPage" */ "@/views/main/roleJPage/RoleJPageDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-rolejpage",
          component: () =>
            import(
              /* webpackChunkName: "import-data-roleJPage" */ "@/views/main/roleJPage/RoleJPageImportData.vue"
            ),
        },
      ],
    },
    {
      path: "stories",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-story",
          component: () =>
            import(
              /* webpackChunkName: "list-story" */ "@/views/main/story/StoryList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-story",
          component: () =>
            import(
              /* webpackChunkName: "create-story" */ "@/views/main/story/StoryCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-story",
          component: () =>
            import(
              /* webpackChunkName: "edit-story" */ "@/views/main/story/StoryEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-story",
          component: () =>
            import(
              /* webpackChunkName: "detail-story" */ "@/views/main/story/StoryDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-story",
          component: () =>
            import(
              /* webpackChunkName: "import-data-story" */ "@/views/main/story/StoryImportData.vue"
            ),
        },
      ],
    },
    {
      path: "storyevents",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-storyevent",
          component: () =>
            import(
              /* webpackChunkName: "list-storyEvent" */ "@/views/main/storyEvent/StoryEventList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-storyevent",
          component: () =>
            import(
              /* webpackChunkName: "create-storyEvent" */ "@/views/main/storyEvent/StoryEventCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-storyevent",
          component: () =>
            import(
              /* webpackChunkName: "edit-storyEvent" */ "@/views/main/storyEvent/StoryEventEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-storyevent",
          component: () =>
            import(
              /* webpackChunkName: "detail-storyEvent" */ "@/views/main/storyEvent/StoryEventDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-storyevent",
          component: () =>
            import(
              /* webpackChunkName: "import-data-storyEvent" */ "@/views/main/storyEvent/StoryEventImportData.vue"
            ),
        },
      ],
    },
    {
      path: "storyeventinvolves",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-storyeventinvolve",
          component: () =>
            import(
              /* webpackChunkName: "list-storyEventInvolve" */ "@/views/main/storyEventInvolve/StoryEventInvolveList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-storyeventinvolve",
          component: () =>
            import(
              /* webpackChunkName: "create-storyEventInvolve" */ "@/views/main/storyEventInvolve/StoryEventInvolveCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-storyeventinvolve",
          component: () =>
            import(
              /* webpackChunkName: "edit-storyEventInvolve" */ "@/views/main/storyEventInvolve/StoryEventInvolveEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-storyeventinvolve",
          component: () =>
            import(
              /* webpackChunkName: "detail-storyEventInvolve" */ "@/views/main/storyEventInvolve/StoryEventInvolveDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-storyeventinvolve",
          component: () =>
            import(
              /* webpackChunkName: "import-data-storyEventInvolve" */ "@/views/main/storyEventInvolve/StoryEventInvolveImportData.vue"
            ),
        },
      ],
    },
    {
      path: "webelements",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-webelement",
          component: () =>
            import(
              /* webpackChunkName: "list-webElement" */ "@/views/main/webElement/WebElementList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-webelement",
          component: () =>
            import(
              /* webpackChunkName: "create-webElement" */ "@/views/main/webElement/WebElementCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-webelement",
          component: () =>
            import(
              /* webpackChunkName: "edit-webElement" */ "@/views/main/webElement/WebElementEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-webelement",
          component: () =>
            import(
              /* webpackChunkName: "detail-webElement" */ "@/views/main/webElement/WebElementDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-webelement",
          component: () =>
            import(
              /* webpackChunkName: "import-data-webElement" */ "@/views/main/webElement/WebElementImportData.vue"
            ),
        },
      ],
    },
    {
      path: "webelementjlistfilters",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-webelementjlistfilter",
          component: () =>
            import(
              /* webpackChunkName: "list-webElementJListFilter" */ "@/views/main/webElementJListFilter/WebElementJListFilterList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-webelementjlistfilter",
          component: () =>
            import(
              /* webpackChunkName: "create-webElementJListFilter" */ "@/views/main/webElementJListFilter/WebElementJListFilterCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-webelementjlistfilter",
          component: () =>
            import(
              /* webpackChunkName: "edit-webElementJListFilter" */ "@/views/main/webElementJListFilter/WebElementJListFilterEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-webelementjlistfilter",
          component: () =>
            import(
              /* webpackChunkName: "detail-webElementJListFilter" */ "@/views/main/webElementJListFilter/WebElementJListFilterDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-webelementjlistfilter",
          component: () =>
            import(
              /* webpackChunkName: "import-data-webElementJListFilter" */ "@/views/main/webElementJListFilter/WebElementJListFilterImportData.vue"
            ),
        },
      ],
    },
    {
      path: "actoractororientations",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-actoractororientation",
          component: () =>
            import(
              /* webpackChunkName: "list-actorActorOrientation" */ "@/views/main/actorActorOrientation/ActorActorOrientationList.vue"
            ),
        },
        {
          path: "create",
          name: "admin-create-actoractororientation",
          component: () =>
            import(
              /* webpackChunkName: "create-actorActorOrientation" */ "@/views/main/actorActorOrientation/ActorActorOrientationCreate.vue"
            ),
        },
        {
          path: "edit/:id",
          name: "admin-edit-actoractororientation",
          component: () =>
            import(
              /* webpackChunkName: "edit-actorActorOrientation" */ "@/views/main/actorActorOrientation/ActorActorOrientationEdit.vue"
            ),
        },
        {
          path: ":id",
          name: "admin-detail-actoractororientation",
          component: () =>
            import(
              /* webpackChunkName: "detail-actorActorOrientation" */ "@/views/main/actorActorOrientation/ActorActorOrientationDetail.vue"
            ),
        },
        {
          path: "import",
          name: "admin-import-data-actoractororientation",
          component: () =>
            import(
              /* webpackChunkName: "import-data-actorActorOrientation" */ "@/views/main/actorActorOrientation/ActorActorOrientationImportData.vue"
            ),
        },
      ],
    },
    {
      path: "historiques",
      meta: {
        requiresAuth: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */ "@/components/layouts/mainLayout/Layout.vue"
        ),
      children: [
        {
          path: "",
          name: "admin-list-historiques",
          component: () =>
            import(
              /* webpackChunkName: "list-actorActorOrientation" */ "@/views/main/historique/HistoriqueList.vue"
            ),
        },
      ],
    },
  ],
};
