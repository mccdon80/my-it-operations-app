BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[meetings] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [meeting_date] DATETIME2 NOT NULL,
    [location] NVARCHAR(1000),
    [organizer_id] NVARCHAR(1000) NOT NULL,
    [minutes_content] TEXT,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [meetings_status_df] DEFAULT 'Draft',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [meetings_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [meetings_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[meeting_attendees] (
    [id] NVARCHAR(1000) NOT NULL,
    [meeting_id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [attendance_status] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [meeting_attendees_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[action_items] (
    [id] NVARCHAR(1000) NOT NULL,
    [meeting_id] NVARCHAR(1000) NOT NULL,
    [description] TEXT NOT NULL,
    [assigned_to] NVARCHAR(1000),
    [due_date] DATE,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [action_items_status_df] DEFAULT 'Open',
    [priority] NVARCHAR(1000) NOT NULL CONSTRAINT [action_items_priority_df] DEFAULT 'Medium',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [action_items_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [action_items_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[meeting_attendees] ADD CONSTRAINT [meeting_attendees_meeting_id_fkey] FOREIGN KEY ([meeting_id]) REFERENCES [dbo].[meetings]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[action_items] ADD CONSTRAINT [action_items_meeting_id_fkey] FOREIGN KEY ([meeting_id]) REFERENCES [dbo].[meetings]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
