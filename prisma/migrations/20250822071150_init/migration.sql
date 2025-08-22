BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [department] NVARCHAR(1000),
    [active] BIT NOT NULL CONSTRAINT [users_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [users_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[campuses] (
    [id] NVARCHAR(1000) NOT NULL,
    [campus_name] NVARCHAR(1000) NOT NULL,
    [campus_code] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [total_area] DECIMAL(10,2),
    [description] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [campuses_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [campuses_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [campuses_campus_code_key] UNIQUE NONCLUSTERED ([campus_code])
);

-- CreateTable
CREATE TABLE [dbo].[buildings] (
    [id] NVARCHAR(1000) NOT NULL,
    [campus_id] NVARCHAR(1000) NOT NULL,
    [building_name] NVARCHAR(1000) NOT NULL,
    [building_code] NVARCHAR(1000) NOT NULL,
    [total_floors] INT,
    [total_area] DECIMAL(10,2),
    [description] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [buildings_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [buildings_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[floors] (
    [id] NVARCHAR(1000) NOT NULL,
    [building_id] NVARCHAR(1000) NOT NULL,
    [floor_name] NVARCHAR(1000) NOT NULL,
    [floor_code] NVARCHAR(1000) NOT NULL,
    [area] DECIMAL(10,2),
    [room_count] INT NOT NULL CONSTRAINT [floors_room_count_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [floors_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [floors_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[rooms] (
    [id] NVARCHAR(1000) NOT NULL,
    [floor_id] NVARCHAR(1000) NOT NULL,
    [room_number] NVARCHAR(1000) NOT NULL,
    [campus_name] NVARCHAR(1000) NOT NULL,
    [building_name] NVARCHAR(1000) NOT NULL,
    [floor_name] NVARCHAR(1000) NOT NULL,
    [ownership] NVARCHAR(1000),
    [owner] NVARCHAR(1000),
    [customer_note] NVARCHAR(1000),
    [other_remarks] NVARCHAR(1000),
    [room_size_sqm] DECIMAL(10,2),
    [seating_capacity] INT,
    [room_height] NVARCHAR(1000),
    [paint_color_code] NVARCHAR(1000),
    [room_category] NVARCHAR(1000),
    [room_type] NVARCHAR(1000),
    [elv_idf_bdf_room] NVARCHAR(1000),
    [distance_meters] DECIMAL(10,2),
    [remarks] NVARCHAR(1000),
    [current_status] NVARCHAR(1000) NOT NULL CONSTRAINT [rooms_current_status_df] DEFAULT 'Active',
    [last_updated] DATETIME2 NOT NULL CONSTRAINT [rooms_last_updated_df] DEFAULT CURRENT_TIMESTAMP,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [rooms_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [created_by] NVARCHAR(1000),
    [updated_by] NVARCHAR(1000),
    CONSTRAINT [rooms_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [rooms_room_number_key] UNIQUE NONCLUSTERED ([room_number])
);

-- CreateTable
CREATE TABLE [dbo].[it_assets] (
    [id] NVARCHAR(1000) NOT NULL,
    [asset_tag] NVARCHAR(1000) NOT NULL,
    [asset_type] NVARCHAR(1000) NOT NULL,
    [brand] NVARCHAR(1000),
    [model] NVARCHAR(1000),
    [serial_number] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [it_assets_status_df] DEFAULT 'Available',
    [assigned_to] NVARCHAR(1000),
    [assigned_date] DATETIME2,
    [location] NVARCHAR(1000),
    [purchase_date] DATETIME2,
    [warranty_expiry] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [it_assets_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [it_assets_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [it_assets_asset_tag_key] UNIQUE NONCLUSTERED ([asset_tag])
);

-- CreateTable
CREATE TABLE [dbo].[amc_system_categories] (
    [id] NVARCHAR(1000) NOT NULL,
    [category_name] NVARCHAR(1000) NOT NULL,
    [category_code] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [amc_system_categories_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [amc_system_categories_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [amc_system_categories_category_code_key] UNIQUE NONCLUSTERED ([category_code])
);

-- CreateTable
CREATE TABLE [dbo].[amc_systems] (
    [id] NVARCHAR(1000) NOT NULL,
    [system_name] NVARCHAR(1000) NOT NULL,
    [system_code] NVARCHAR(1000),
    [category_id] NVARCHAR(1000),
    [location] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [installation_date] DATE,
    [warranty_expiry] DATE,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [amc_systems_status_df] DEFAULT 'Active',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [amc_systems_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [amc_systems_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [amc_systems_system_code_key] UNIQUE NONCLUSTERED ([system_code])
);

-- CreateTable
CREATE TABLE [dbo].[amc_contracts] (
    [id] NVARCHAR(1000) NOT NULL,
    [contract_number] NVARCHAR(1000) NOT NULL,
    [system_id] NVARCHAR(1000),
    [contractor_id] NVARCHAR(1000),
    [contract_type] NVARCHAR(1000) NOT NULL,
    [contract_value] DECIMAL(15,2) NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NOT NULL,
    [sla_terms] NVARCHAR(1000),
    [response_time_hours] INT,
    [resolution_time_hours] INT,
    [penalty_clause] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [amc_contracts_status_df] DEFAULT 'Active',
    [auto_renewal] BIT NOT NULL CONSTRAINT [amc_contracts_auto_renewal_df] DEFAULT 0,
    [renewal_notice_days] INT NOT NULL CONSTRAINT [amc_contracts_renewal_notice_days_df] DEFAULT 60,
    [created_by] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [amc_contracts_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [amc_contracts_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [amc_contracts_contract_number_key] UNIQUE NONCLUSTERED ([contract_number])
);

-- CreateTable
CREATE TABLE [dbo].[contractors] (
    [id] NVARCHAR(1000) NOT NULL,
    [company_name] NVARCHAR(1000) NOT NULL,
    [contact_name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [contractors_status_df] DEFAULT 'Active',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [contractors_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [contractors_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[projects] (
    [id] NVARCHAR(1000) NOT NULL,
    [project_name] NVARCHAR(1000) NOT NULL,
    [project_type] NVARCHAR(1000) NOT NULL,
    [system_type] NVARCHAR(1000),
    [category_type] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [start_date] DATE,
    [end_date] DATE,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [projects_status_df] DEFAULT 'Planning',
    [project_manager_id] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [projects_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [projects_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[leave_applications] (
    [id] NVARCHAR(1000) NOT NULL,
    [employee_id] NVARCHAR(1000) NOT NULL,
    [leave_type] NVARCHAR(1000) NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NOT NULL,
    [days_count] INT NOT NULL,
    [reason] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [leave_applications_status_df] DEFAULT 'Pending',
    [approved_by] NVARCHAR(1000),
    [approval_date] DATETIME2,
    [comments] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [leave_applications_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [leave_applications_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[room_projects] (
    [id] NVARCHAR(1000) NOT NULL,
    [room_id] NVARCHAR(1000) NOT NULL,
    [project_id] NVARCHAR(1000),
    [project_type] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [budget_allocated] DECIMAL(15,2),
    [actual_cost] DECIMAL(15,2),
    [start_date] DATE,
    [completion_date] DATE,
    [contractor_id] NVARCHAR(1000),
    [project_status] NVARCHAR(1000) NOT NULL CONSTRAINT [room_projects_project_status_df] DEFAULT 'Planning',
    [created_by] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [room_projects_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [room_projects_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[room_variation_requests] (
    [id] NVARCHAR(1000) NOT NULL,
    [room_id] NVARCHAR(1000) NOT NULL,
    [request_type] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [justification] NVARCHAR(1000),
    [estimated_cost] DECIMAL(15,2),
    [requested_by] NVARCHAR(1000) NOT NULL,
    [request_date] DATE NOT NULL,
    [priority] NVARCHAR(1000) NOT NULL CONSTRAINT [room_variation_requests_priority_df] DEFAULT 'Medium',
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [room_variation_requests_status_df] DEFAULT 'Submitted',
    [assigned_to] NVARCHAR(1000),
    [estimated_completion_date] DATE,
    [actual_completion_date] DATE,
    [actual_cost] DECIMAL(15,2),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [room_variation_requests_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [room_variation_requests_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[room_ppm_schedules] (
    [id] NVARCHAR(1000) NOT NULL,
    [room_id] NVARCHAR(1000) NOT NULL,
    [ppm_type] NVARCHAR(1000) NOT NULL,
    [frequency] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [assigned_to] NVARCHAR(1000),
    [contractor_id] NVARCHAR(1000),
    [last_performed_date] DATE,
    [next_due_date] DATE,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [room_ppm_schedules_status_df] DEFAULT 'Scheduled',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [room_ppm_schedules_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [room_ppm_schedules_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[notifications] (
    [id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [message] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [related_entity_type] NVARCHAR(1000),
    [related_entity_id] NVARCHAR(1000),
    [is_read] BIT NOT NULL CONSTRAINT [notifications_is_read_df] DEFAULT 0,
    [sent_via_email] BIT NOT NULL CONSTRAINT [notifications_sent_via_email_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [notifications_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [notifications_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[system_logs] (
    [id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000),
    [action] NVARCHAR(1000) NOT NULL,
    [entity_type] NVARCHAR(1000),
    [entity_id] NVARCHAR(1000),
    [ip_address] NVARCHAR(1000),
    [user_agent] NVARCHAR(1000),
    [details] NVARCHAR(1000),
    [timestamp] DATETIME2 NOT NULL CONSTRAINT [system_logs_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [system_logs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[buildings] ADD CONSTRAINT [buildings_campus_id_fkey] FOREIGN KEY ([campus_id]) REFERENCES [dbo].[campuses]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[floors] ADD CONSTRAINT [floors_building_id_fkey] FOREIGN KEY ([building_id]) REFERENCES [dbo].[buildings]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[rooms] ADD CONSTRAINT [rooms_floor_id_fkey] FOREIGN KEY ([floor_id]) REFERENCES [dbo].[floors]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[amc_systems] ADD CONSTRAINT [amc_systems_category_id_fkey] FOREIGN KEY ([category_id]) REFERENCES [dbo].[amc_system_categories]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[amc_contracts] ADD CONSTRAINT [amc_contracts_system_id_fkey] FOREIGN KEY ([system_id]) REFERENCES [dbo].[amc_systems]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[amc_contracts] ADD CONSTRAINT [amc_contracts_contractor_id_fkey] FOREIGN KEY ([contractor_id]) REFERENCES [dbo].[contractors]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
