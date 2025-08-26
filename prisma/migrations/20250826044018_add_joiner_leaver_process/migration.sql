BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[joiner_leaver_processes] (
    [id] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [employee_name] NVARCHAR(1000) NOT NULL,
    [employee_id] NVARCHAR(1000),
    [department] NVARCHAR(1000) NOT NULL,
    [position] NVARCHAR(1000),
    [manager] NVARCHAR(1000) NOT NULL,
    [start_date] DATE,
    [end_date] DATE,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [joiner_leaver_processes_status_df] DEFAULT 'Draft',
    [total_items] INT NOT NULL CONSTRAINT [joiner_leaver_processes_total_items_df] DEFAULT 0,
    [completed_items] INT NOT NULL CONSTRAINT [joiner_leaver_processes_completed_items_df] DEFAULT 0,
    [progress_percentage] INT NOT NULL CONSTRAINT [joiner_leaver_processes_progress_percentage_df] DEFAULT 0,
    [notes] TEXT,
    [completion_notes] TEXT,
    [created_by] NVARCHAR(1000),
    [updated_by] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [joiner_leaver_processes_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [joiner_leaver_processes_is_deleted_df] DEFAULT 0,
    CONSTRAINT [joiner_leaver_processes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[joiner_leaver_checklist_items] (
    [id] NVARCHAR(1000) NOT NULL,
    [process_id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] TEXT NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    [is_required] BIT NOT NULL CONSTRAINT [joiner_leaver_checklist_items_is_required_df] DEFAULT 0,
    [sort_order] INT NOT NULL CONSTRAINT [joiner_leaver_checklist_items_sort_order_df] DEFAULT 0,
    [document_url] NVARCHAR(1000),
    [document_name] NVARCHAR(1000),
    [completed] BIT NOT NULL CONSTRAINT [joiner_leaver_checklist_items_completed_df] DEFAULT 0,
    [completed_at] DATETIME2,
    [completed_by] NVARCHAR(1000),
    [completed_by_name] NVARCHAR(1000),
    [notes] TEXT,
    [completion_notes] TEXT,
    [created_by] NVARCHAR(1000),
    [updated_by] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [joiner_leaver_checklist_items_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [joiner_leaver_checklist_items_is_deleted_df] DEFAULT 0,
    CONSTRAINT [joiner_leaver_checklist_items_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_processes_type_idx] ON [dbo].[joiner_leaver_processes]([type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_processes_status_idx] ON [dbo].[joiner_leaver_processes]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_processes_department_idx] ON [dbo].[joiner_leaver_processes]([department]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_processes_created_by_idx] ON [dbo].[joiner_leaver_processes]([created_by]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_processes_is_deleted_idx] ON [dbo].[joiner_leaver_processes]([is_deleted]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_checklist_items_process_id_idx] ON [dbo].[joiner_leaver_checklist_items]([process_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_checklist_items_category_idx] ON [dbo].[joiner_leaver_checklist_items]([category]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_checklist_items_completed_idx] ON [dbo].[joiner_leaver_checklist_items]([completed]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_checklist_items_is_required_idx] ON [dbo].[joiner_leaver_checklist_items]([is_required]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_checklist_items_sort_order_idx] ON [dbo].[joiner_leaver_checklist_items]([sort_order]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [joiner_leaver_checklist_items_is_deleted_idx] ON [dbo].[joiner_leaver_checklist_items]([is_deleted]);

-- AddForeignKey
ALTER TABLE [dbo].[joiner_leaver_checklist_items] ADD CONSTRAINT [joiner_leaver_checklist_items_process_id_fkey] FOREIGN KEY ([process_id]) REFERENCES [dbo].[joiner_leaver_processes]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
