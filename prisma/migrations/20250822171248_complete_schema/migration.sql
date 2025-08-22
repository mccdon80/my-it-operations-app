BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[asset_handovers] (
    [id] NVARCHAR(1000) NOT NULL,
    [handover_number] NVARCHAR(1000) NOT NULL,
    [employee_name] NVARCHAR(1000) NOT NULL,
    [employee_email] NVARCHAR(1000) NOT NULL,
    [employee_id] NVARCHAR(1000),
    [department] NVARCHAR(1000) NOT NULL,
    [position] NVARCHAR(1000),
    [manager] NVARCHAR(1000),
    [manager_email] NVARCHAR(1000),
    [handover_date] DATE NOT NULL,
    [handover_type] NVARCHAR(1000) NOT NULL,
    [purpose] NVARCHAR(1000),
    [notes] TEXT,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [asset_handovers_status_df] DEFAULT 'Draft',
    [submitted_by] NVARCHAR(1000) NOT NULL,
    [submitted_at] DATETIME2,
    [approved_by] NVARCHAR(1000),
    [approved_at] DATETIME2,
    [rejection_reason] TEXT,
    [completed_at] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [asset_handovers_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [asset_handovers_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [asset_handovers_handover_number_key] UNIQUE NONCLUSTERED ([handover_number])
);

-- CreateTable
CREATE TABLE [dbo].[asset_handover_items] (
    [id] NVARCHAR(1000) NOT NULL,
    [handover_id] NVARCHAR(1000) NOT NULL,
    [asset_id] NVARCHAR(1000) NOT NULL,
    [asset_tag] NVARCHAR(1000) NOT NULL,
    [asset_type] NVARCHAR(1000) NOT NULL,
    [brand] NVARCHAR(1000),
    [model] NVARCHAR(1000),
    [serial_number] NVARCHAR(1000),
    [condition] NVARCHAR(1000) NOT NULL CONSTRAINT [asset_handover_items_condition_df] DEFAULT 'Good',
    [accessories] TEXT,
    [notes] TEXT,
    [handover_status] NVARCHAR(1000) NOT NULL CONSTRAINT [asset_handover_items_handover_status_df] DEFAULT 'Pending',
    [handed_over_at] DATETIME2,
    [returned_at] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [asset_handover_items_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [asset_handover_items_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[handover_approvals] (
    [id] NVARCHAR(1000) NOT NULL,
    [handover_id] NVARCHAR(1000) NOT NULL,
    [approver_email] NVARCHAR(1000) NOT NULL,
    [approver_name] NVARCHAR(1000) NOT NULL,
    [approver_role] NVARCHAR(1000) NOT NULL,
    [approval_level] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [handover_approvals_status_df] DEFAULT 'Pending',
    [approved_at] DATETIME2,
    [comments] TEXT,
    [email_sent_at] DATETIME2,
    [reminders_sent] INT NOT NULL CONSTRAINT [handover_approvals_reminders_sent_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [handover_approvals_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [handover_approvals_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[handover_templates] (
    [id] NVARCHAR(1000) NOT NULL,
    [template_name] NVARCHAR(1000) NOT NULL,
    [department] NVARCHAR(1000),
    [position] NVARCHAR(1000),
    [asset_types] TEXT NOT NULL,
    [approvers] TEXT NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [handover_templates_is_active_df] DEFAULT 1,
    [created_by] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [handover_templates_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [handover_templates_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[asset_handover_items] ADD CONSTRAINT [asset_handover_items_handover_id_fkey] FOREIGN KEY ([handover_id]) REFERENCES [dbo].[asset_handovers]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[handover_approvals] ADD CONSTRAINT [handover_approvals_handover_id_fkey] FOREIGN KEY ([handover_id]) REFERENCES [dbo].[asset_handovers]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
