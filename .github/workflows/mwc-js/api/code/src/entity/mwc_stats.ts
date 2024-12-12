import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {gps} from "./gps";


@Entity("mwc_stats",{schema:"pool"})
@Index("ix_mwc_stats_timestamp",["timestamp",])
@Index("ix_mwc_stats_height",["height",])
export class mwc_stats {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"height"
        })
    height:string;
        

    @Column("datetime",{ 
        nullable:false,
        name:"timestamp"
        })
    timestamp:Date;
        

    @Column("bigint",{ 
        nullable:true,
        name:"difficulty"
        })
    difficulty:string | null;
        

   
    @OneToMany(type=>gps, gps=>gps.mwc_stats_,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    gpss:gps[];
    
}
