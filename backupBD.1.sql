USE [JobAccauntingDB]
GO
/****** Object:  Table [dbo].[AgrFieldLocation]    Script Date: 5/14/2016 1:57:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AgrFieldLocation](
	[AgrFieldLocationId] [int] IDENTITY(1,1) NOT NULL,
	[FieldId] [int] NOT NULL,
	[lat] [float] NOT NULL,
	[lng] [float] NOT NULL
)

GO
/****** Object:  Table [dbo].[CultureIconLinks]    Script Date: 5/14/2016 1:57:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CultureIconLinks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CultureId] [int] NOT NULL,
	[CultureIconLinl] [nvarchar](max) NULL,
 CONSTRAINT [PK_CultureIconLinks] PRIMARY KEY NONCLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
/****** Object:  Table [dbo].[Cultures]    Script Date: 5/14/2016 1:57:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cultures](
	[CultureID] [int] IDENTITY(1,1) NOT NULL,
	[CultureName] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.Cultures] PRIMARY KEY CLUSTERED 
(
	[CultureID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
/****** Object:  Table [dbo].[FieldPlanningJobs]    Script Date: 5/14/2016 1:57:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FieldPlanningJobs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FieldId] [int] NOT NULL,
	[YearPlanning] [int] NOT NULL,
	[CultureId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
/****** Object:  Table [dbo].[Fields]    Script Date: 5/14/2016 1:57:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Fields](
	[FieldID] [int] IDENTITY(1,1) NOT NULL,
	[FieldName] [nvarchar](max) NULL,
	[Area] [real] NULL DEFAULT ((0.0)),
	[OwnerName] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.Fields] PRIMARY KEY CLUSTERED 
(
	[FieldID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
ALTER TABLE [dbo].[AgrFieldLocation]  WITH NOCHECK ADD  CONSTRAINT [FK__AgrFieldL__Field__5BE2A6F2] FOREIGN KEY([FieldId])
REFERENCES [dbo].[Fields] ([FieldID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AgrFieldLocation] CHECK CONSTRAINT [FK__AgrFieldL__Field__5BE2A6F2]
GO
ALTER TABLE [dbo].[CultureIconLinks]  WITH CHECK ADD  CONSTRAINT [FK_CultureIconLinks_Culture_Id_Cultured] FOREIGN KEY([CultureId])
REFERENCES [dbo].[Cultures] ([CultureID])
GO
ALTER TABLE [dbo].[CultureIconLinks] CHECK CONSTRAINT [FK_CultureIconLinks_Culture_Id_Cultured]
GO
ALTER TABLE [dbo].[FieldPlanningJobs]  WITH CHECK ADD FOREIGN KEY([CultureId])
REFERENCES [dbo].[Cultures] ([CultureID])
GO
ALTER TABLE [dbo].[FieldPlanningJobs]  WITH CHECK ADD FOREIGN KEY([FieldId])
REFERENCES [dbo].[Fields] ([FieldID])
GO
